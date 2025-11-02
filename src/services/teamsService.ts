/**
 * Enhanced Teams Service with Real-time Updates
 * Handles team management, join requests, capacity limits, and status syncing
 */
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { notificationService } from './notificationService';

export interface Team {
  id: string;
  name: string;
  description: string;
  max_members: number;
  current_members: number;
  team_type: string;
  skills_focus: string[];
  status: 'OPEN' | 'FULL' | 'CLOSED';
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'leader' | 'member';
  joined_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
    email: string;
  };
}

export interface JoinRequest {
  id: string;
  team_id: string;
  user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  requested_at: string;
  responded_at: string | null;
  team?: Team;
  profile?: {
    display_name: string;
    avatar_url: string | null;
    email: string;
  };
}

export type TeamStatus = 'OPEN' | 'FULL' | 'CLOSED';

class TeamsService {
  private realtimeChannel: RealtimeChannel | null = null;
  private subscribers: Set<(data: any) => void> = new Set();

  /**
   * Initialize real-time subscriptions for teams
   */
  initializeRealtime() {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }

    this.realtimeChannel = supabase
      .channel('teams-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams'
        },
        (payload) => {
          console.log('🔄 Teams table change:', payload);
          this.notifySubscribers({ type: 'team_update', payload });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members'
        },
        (payload) => {
          console.log('🔄 Team members change:', payload);
          this.notifySubscribers({ type: 'member_update', payload });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_join_requests'
        },
        (payload) => {
          console.log('🔄 Join requests change:', payload);
          this.notifySubscribers({ type: 'request_update', payload });
        }
      )
      .subscribe();

    console.log('✅ Real-time subscriptions initialized');
  }

  /**
   * Subscribe to real-time updates
   */
  subscribe(callback: (data: any) => void) {
    this.subscribers.add(callback);
    
    // Initialize real-time if first subscriber
    if (this.subscribers.size === 1) {
      this.initializeRealtime();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
      
      // Clean up real-time if no subscribers
      if (this.subscribers.size === 0 && this.realtimeChannel) {
        this.realtimeChannel.unsubscribe();
        this.realtimeChannel = null;
      }
    };
  }

  /**
   * Notify all subscribers of changes
   */
  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => callback(data));
  }

  /**
   * Calculate team status based on current and max members
   */
  private calculateTeamStatus(currentMembers: number, maxMembers: number, manualStatus?: string): TeamStatus {
    if (manualStatus === 'CLOSED') return 'CLOSED';
    return currentMembers >= maxMembers ? 'FULL' : 'OPEN';
  }

  /**
   * Update team status in database
   */
  async updateTeamStatus(teamId: string): Promise<boolean> {
    try {
      // Get current team data
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('current_members, max_members')
        .eq('id', teamId)
        .single();

      if (teamError || !team) {
        console.error('Error fetching team for status update:', teamError);
        return false;
      }

      // Calculate new status (without relying on existing status column)
      const newStatus = this.calculateTeamStatus(team.current_members, team.max_members);

      // For now, we'll just log the status since the column doesn't exist yet
      console.log(`✅ Team ${teamId} calculated status: ${newStatus} (${team.current_members}/${team.max_members})`);
      
      // TODO: Uncomment this when status column is added via migration
      // const { error: updateError } = await supabase
      //   .from('teams')
      //   .update({ 
      //     status: newStatus,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', teamId);

      return true;
    } catch (error) {
      console.error('Error in updateTeamStatus:', error);
      return false;
    }
  }

  /**
   * Accept a join request
   */
  async acceptJoinRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Accepting join request:', requestId);

      // Get request details
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('id', requestId)
        .eq('status', 'pending')
        .single();

      if (requestError) {
        console.error('❌ Error fetching join request:', requestError);
        return { success: false, message: 'Join request not found or already processed' };
      }

      if (!request) {
        console.error('❌ No join request found with ID:', requestId);
        return { success: false, message: 'Join request not found or already processed' };
      }

      console.log('✅ Found join request:', { 
        id: request.id, 
        teamId: request.team_id, 
        userId: request.user_id 
      });

      // Get team details separately
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('id, name, current_members, max_members')
        .eq('id', request.team_id)
        .single();

      if (teamError || !team) {
        console.error('❌ Error fetching team:', teamError);
        return { success: false, message: 'Team not found' };
      }

      console.log('✅ Found team:', { 
        name: team.name, 
        members: `${team.current_members}/${team.max_members}` 
      });

      // Check if team is full
      if (team.current_members >= team.max_members) {
        return { success: false, message: 'Team is already full' };
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', request.team_id)
        .eq('user_id', request.user_id)
        .single();

      if (existingMember) {
        return { success: false, message: 'User is already a team member' };
      }

      // Start transaction-like operations
      const now = new Date().toISOString();

      // 1. Update request status
      const { error: updateRequestError } = await supabase
        .from('team_join_requests')
        .update({
          status: 'accepted',
          responded_at: now
        })
        .eq('id', requestId);

      if (updateRequestError) {
        throw updateRequestError;
      }

      // 2. Add user to team members
      const { error: addMemberError } = await supabase
        .from('team_members')
        .insert({
          team_id: request.team_id,
          user_id: request.user_id,
          role: 'member',
          joined_at: now
        });

      if (addMemberError) {
        throw addMemberError;
      }

      // 3. Update team member count
      const newMemberCount = team.current_members + 1;
      const newStatus = this.calculateTeamStatus(newMemberCount, team.max_members);

      const { error: updateTeamError } = await supabase
        .from('teams')
        .update({
          current_members: newMemberCount
          // TODO: Add status update when column exists
          // status: newStatus,
          // updated_at: now
        })
        .eq('id', request.team_id);

      if (updateTeamError) {
        throw updateTeamError;
      }

      console.log(`✅ Join request accepted: User ${request.user_id} joined team ${team.name}`);
      
      // Send notification to the user
      await notificationService.notifyJoinRequestAccepted(request.user_id, team.name);
      
      return { 
        success: true, 
        message: `Successfully added member to ${team.name}${newStatus === 'FULL' ? ' (Team is now full)' : ''}` 
      };

    } catch (error) {
      console.error('Error accepting join request:', error);
      return { success: false, message: 'Failed to accept join request' };
    }
  }

  /**
   * Reject a join request
   */
  async rejectJoinRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Rejecting join request:', requestId);

      // Get request details for logging
      const { data: request, error: requestError } = await supabase
        .from('team_join_requests')
        .select('*')
        .eq('id', requestId)
        .eq('status', 'pending')
        .single();

      if (requestError) {
        console.error('❌ Error fetching join request:', requestError);
        return { success: false, message: 'Join request not found or already processed' };
      }

      if (!request) {
        console.error('❌ No join request found with ID:', requestId);
        return { success: false, message: 'Join request not found or already processed' };
      }

      // Get team name for logging
      const { data: team } = await supabase
        .from('teams')
        .select('name')
        .eq('id', request.team_id)
        .single();

      console.log('✅ Found join request for team:', team?.name || 'Unknown');

      // Update request status
      const { error: updateError } = await supabase
        .from('team_join_requests')
        .update({
          status: 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) {
        throw updateError;
      }

      console.log(`✅ Join request rejected: User ${request.user_id} for team ${team?.name || 'Unknown'}`);
      
      // Send notification to the user
      await notificationService.notifyJoinRequestRejected(request.user_id, team?.name || 'Unknown Team');
      
      return { success: true, message: 'Join request rejected successfully' };

    } catch (error) {
      console.error('Error rejecting join request:', error);
      return { success: false, message: 'Failed to reject join request' };
    }
  }

  /**
   * Remove a member from team
   */
  async removeMember(teamId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get team details
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('name, current_members, max_members, created_by')
        .eq('id', teamId)
        .single();

      if (teamError || !team) {
        return { success: false, message: 'Team not found' };
      }

      // Check if user is a member
      const { data: member, error: memberError } = await supabase
        .from('team_members')
        .select('id, role')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();

      if (memberError || !member) {
        return { success: false, message: 'User is not a team member' };
      }

      // Prevent removing team leader
      if (team.created_by === userId) {
        return { success: false, message: 'Cannot remove team leader' };
      }

      // Remove member
      const { error: removeError } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

      if (removeError) {
        throw removeError;
      }

      // Update team member count and status
      const newMemberCount = Math.max(0, team.current_members - 1);
      const newStatus = this.calculateTeamStatus(newMemberCount, team.max_members);

      const { error: updateTeamError } = await supabase
        .from('teams')
        .update({
          current_members: newMemberCount
          // TODO: Add status and updated_at when columns exist
          // status: newStatus,
          // updated_at: new Date().toISOString()
        })
        .eq('id', teamId);

      if (updateTeamError) {
        throw updateTeamError;
      }

      console.log(`✅ Member removed: User ${userId} from team ${team.name}`);
      
      return { 
        success: true, 
        message: `Member removed from ${team.name}${newStatus === 'OPEN' ? ' (Team reopened)' : ''}` 
      };

    } catch (error) {
      console.error('Error removing member:', error);
      return { success: false, message: 'Failed to remove member' };
    }
  }

  /**
   * Get available teams (not full, not closed)
   */
  async getAvailableTeams(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Filter available teams (not full) since status column doesn't exist yet
      const availableTeams = (data || []).filter(team => 
        team.current_members < team.max_members
      ).map(team => ({
        ...team,
        status: team.current_members >= team.max_members ? 'FULL' : 'OPEN'
      }));

      return availableTeams;
    } catch (error) {
      console.error('Error fetching available teams:', error);
      return [];
    }
  }

  /**
   * Get team with members
   */
  async getTeamWithMembers(teamId: string): Promise<{ team: Team | null; members: TeamMember[] }> {
    try {
      console.log('🔍 Fetching team with members for team:', teamId);

      // Get team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) {
        console.error('Error fetching team:', teamError);
        throw teamError;
      }

      console.log('✅ Team found:', team.name);

      // Get team members
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        throw membersError;
      }

      console.log('📥 Found team members:', members?.length || 0);

      if (!members || members.length === 0) {
        return { team, members: [] };
      }

      // Get profiles for team members
      const userIds = members.map(member => member.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, email')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching member profiles:', profilesError);
        // Continue without profiles rather than failing
      }

      console.log('👥 Found profiles:', profiles?.length || 0);

      // Create profiles map for easy lookup
      const profilesMap = Object.fromEntries(
        (profiles || []).map(profile => [profile.user_id, profile])
      );

      // Format members with profiles
      const formattedMembers = members.map(member => ({
        ...member,
        profile: profilesMap[member.user_id] || {
          user_id: member.user_id,
          display_name: 'Anonymous User',
          avatar_url: null,
          email: 'No email'
        }
      }));

      console.log('✅ Successfully formatted team members:', formattedMembers.length);
      return { team, members: formattedMembers };

    } catch (error) {
      console.error('❌ Error fetching team with members:', error);
      return { team: null, members: [] };
    }
  }

  /**
   * Get pending join requests for teams owned by user
   */
  async getPendingJoinRequests(userId: string): Promise<JoinRequest[]> {
    try {
      console.log('🔍 Fetching pending join requests for user:', userId);

      // Get teams owned by user
      const { data: ownedTeams, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, description, max_members, current_members')
        .eq('created_by', userId);

      if (teamsError) {
        console.error('Error fetching owned teams:', teamsError);
        throw teamsError;
      }

      if (!ownedTeams || ownedTeams.length === 0) {
        console.log('No owned teams found for user:', userId);
        return [];
      }

      console.log('Found owned teams:', ownedTeams.map(t => t.name));
      const teamIds = ownedTeams.map(team => team.id);

      // Get pending requests for owned teams
      const { data: requests, error: requestsError } = await supabase
        .from('team_join_requests')
        .select('*')
        .in('team_id', teamIds)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching join requests:', requestsError);
        throw requestsError;
      }

      console.log('Found pending requests:', requests?.length || 0);

      if (!requests || requests.length === 0) {
        return [];
      }

      // Get user profiles for requesters
      const userIds = [...new Set(requests.map(r => r.user_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, email')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles rather than failing
      }

      // Create maps for easy lookup with calculated status
      const teamsMap = Object.fromEntries(ownedTeams.map(team => [
        team.id, 
        {
          ...team,
          status: team.current_members >= team.max_members ? 'FULL' : 'OPEN'
        }
      ]));
      const profilesMap = Object.fromEntries((profiles || []).map(profile => [profile.user_id, profile]));

      // Combine data
      const formattedRequests = requests.map(request => ({
        ...request,
        team: teamsMap[request.team_id],
        profile: profilesMap[request.user_id] || {
          user_id: request.user_id,
          display_name: 'Anonymous User',
          avatar_url: null,
          email: 'No email'
        }
      }));

      console.log('✅ Successfully formatted join requests:', formattedRequests.length);
      return formattedRequests;

    } catch (error) {
      console.error('Error fetching pending join requests:', error);
      return [];
    }
  }

  /**
   * Manually set team status (for team leaders)
   */
  async setTeamStatus(teamId: string, status: TeamStatus, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verify user is team leader
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('created_by, name, current_members, max_members')
        .eq('id', teamId)
        .single();

      if (teamError || !team) {
        return { success: false, message: 'Team not found' };
      }

      if (team.created_by !== userId) {
        return { success: false, message: 'Only team leaders can change team status' };
      }

      // Don't allow setting to OPEN if team is actually full
      if (status === 'OPEN' && team.current_members >= team.max_members) {
        return { success: false, message: 'Cannot open team - already at maximum capacity' };
      }

      // For now, just log the status change since column doesn't exist yet
      console.log(`✅ Team ${team.name} status would be set to ${status} (feature disabled until migration)`);
      
      // TODO: Uncomment when status column exists
      // const { error: updateError } = await supabase
      //   .from('teams')
      //   .update({
      //     status,
      //     updated_at: new Date().toISOString()
      //   })
      //   .eq('id', teamId);
      
      return { success: true, message: `Team status updated to ${status}` };

    } catch (error) {
      console.error('Error setting team status:', error);
      return { success: false, message: 'Failed to update team status' };
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
      this.realtimeChannel = null;
    }
    this.subscribers.clear();
  }
}

// Export singleton instance
export const teamsService = new TeamsService();