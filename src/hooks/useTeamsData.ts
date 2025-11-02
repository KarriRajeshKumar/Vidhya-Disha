import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { teamsService, Team, JoinRequest, TeamMember } from '@/services/teamsService';
import { notificationService } from '@/services/notificationService';

export interface TeamJoinRequest extends JoinRequest {
  teams: Team;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  };
}

export const useTeamsData = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [joinRequests, setJoinRequests] = useState<TeamJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Real-time update handler
  const handleRealTimeUpdate = useCallback((data: any) => {
    console.log('🔄 Real-time update received:', data);
    
    switch (data.type) {
      case 'team_update':
        fetchTeamsData();
        break;
      case 'member_update':
        fetchTeamsData();
        break;
      case 'request_update':
        fetchJoinRequests();
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    // Initialize data
    initializeData();

    // Subscribe to real-time updates
    const unsubscribe = teamsService.subscribe(handleRealTimeUpdate);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [handleRealTimeUpdate]);

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      await Promise.all([
        fetchTeamsData(),
        fetchJoinRequests()
      ]);
    } catch (error) {
      console.error('Error initializing teams data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamsData = async () => {
    try {
      // Fetch all teams with status
      const { data: allTeams, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Calculate status for teams that might not have it set
      const teamsWithStatus = (allTeams || []).map(team => ({
        ...team,
        status: team.status || (team.current_members >= team.max_members ? 'FULL' : 'OPEN')
      }));

      setTeams(teamsWithStatus);

      // Filter available teams (OPEN status only)
      const available = teamsWithStatus.filter(team => team.status === 'OPEN');
      setAvailableTeams(available);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch user's teams
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select(`
            teams (*)
          `)
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        const userTeamsList = memberData?.map(m => ({
          ...m.teams,
          status: m.teams.status || (m.teams.current_members >= m.teams.max_members ? 'FULL' : 'OPEN')
        })).filter(Boolean) || [];

        setUserTeams(userTeamsList);
      }
    } catch (error) {
      console.error('Error fetching teams data:', error);
      toast({
        title: "Error",
        description: "Failed to load teams data",
        variant: "destructive",
      });
    }
  };

  const fetchJoinRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found, skipping join requests fetch');
        return;
      }

      console.log('🔍 Fetching join requests for user:', user.id);
      const requests = await teamsService.getPendingJoinRequests(user.id);
      console.log('📥 Received join requests:', requests.length);
      
      // Format for compatibility with existing component
      const formattedRequests = requests.map(request => ({
        ...request,
        teams: request.team!,
        profiles: {
          display_name: request.profile?.display_name || 'Anonymous User',
          avatar_url: request.profile?.avatar_url || null
        }
      }));

      console.log('✅ Setting formatted join requests:', formattedRequests.length);
      setJoinRequests(formattedRequests);
    } catch (error) {
      console.error('❌ Error fetching join requests:', error);
    }
  };

  const joinTeam = async (teamId: string, message: string = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if team is available
      const team = teams.find(t => t.id === teamId);
      if (!team) {
        toast({
          title: "Error",
          description: "Team not found",
          variant: "destructive",
        });
        return;
      }

      if (team.status === 'FULL') {
        toast({
          title: "Team Full",
          description: "This team is already at maximum capacity",
          variant: "destructive",
        });
        return;
      }

      if (team.status === 'CLOSED') {
        toast({
          title: "Team Closed",
          description: "This team is not accepting new members",
          variant: "destructive",
        });
        return;
      }

      // Check if user already has a pending request for this team
      const { data: existingRequest } = await supabase
        .from('team_join_requests')
        .select('id, status')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          toast({
            title: "Already Requested",
            description: "You already have a pending join request for this team.",
            variant: "destructive",
          });
          return;
        } else if (existingRequest.status === 'accepted') {
          toast({
            title: "Already Member",
            description: "You are already a member of this team.",
            variant: "destructive",
          });
          return;
        }
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: "Already Member",
          description: "You are already a member of this team.",
          variant: "destructive",
        });
        return;
      }

      console.log('📤 Creating join request:', { teamId, userId: user.id, message });
      
      const { data: insertedRequest, error } = await supabase
        .from('team_join_requests')
        .insert({
          team_id: teamId,
          user_id: user.id,
          message,
          status: 'pending',
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating join request:', error);
        throw error;
      }

      console.log('✅ Join request created successfully:', insertedRequest);

      // Send notification to team owner
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const currentProfile = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', currentUser?.id)
        .single();

      await notificationService.notifyNewJoinRequest(
        team.created_by, 
        currentProfile.data?.display_name || 'Someone', 
        team.name
      );

      toast({
        title: "Success",
        description: "Join request sent successfully!",
      });

      // Refresh join requests for all users (this will trigger real-time updates)
      await fetchJoinRequests();

    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Failed to send join request",
        variant: "destructive",
      });
    }
  };

  const handleJoinRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      let result;
      
      if (action === 'accept') {
        result = await teamsService.acceptJoinRequest(requestId);
      } else {
        result = await teamsService.rejectJoinRequest(requestId);
      }

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });

        // Refresh data
        await Promise.all([
          fetchTeamsData(),
          fetchJoinRequests()
        ]);
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error handling join request:', error);
      toast({
        title: 'Error',
        description: 'Failed to handle request',
        variant: 'destructive',
      });
    }
  };

  const removeMember = async (teamId: string, userId: string) => {
    try {
      const result = await teamsService.removeMember(teamId, userId);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });

        // Refresh data
        await fetchTeamsData();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  const setTeamStatus = async (teamId: string, status: 'OPEN' | 'FULL' | 'CLOSED') => {
    try {
      if (!currentUser) throw new Error('Not authenticated');

      const result = await teamsService.setTeamStatus(teamId, status, currentUser.id);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });

        // Refresh data
        await fetchTeamsData();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error setting team status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update team status',
        variant: 'destructive',
      });
    }
  };

  return {
    teams,
    availableTeams,
    userTeams,
    joinRequests,
    loading,
    currentUser,
    joinTeam,
    handleJoinRequest,
    removeMember,
    setTeamStatus,
    refetch: fetchTeamsData,
  };
};