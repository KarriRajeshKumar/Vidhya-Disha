import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Calendar, 
  Target, 
  Crown,
  Mail,
  UserMinus,
  Settings,
  Lock,
  Unlock,
  UserCheck,
  AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { teamsService, TeamMember } from "@/services/teamsService";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TeamDetailsDialogProps {
  team: any;
  isLeader: boolean;
  children: React.ReactNode;
  onTeamUpdate?: () => void;
}

export const TeamDetailsDialog = ({ team, isLeader, children, onTeamUpdate }: TeamDetailsDialogProps) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMembers = async () => {
    if (!team?.id) return;
    
    setLoading(true);
    try {
      const { team: teamData, members: membersData } = await teamsService.getTeamWithMembers(team.id);
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: string, memberName: string) => {
    if (!team?.id) return;
    
    setActionLoading(`remove-${userId}`);
    try {
      const result = await teamsService.removeMember(team.id, userId);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh members list
        await fetchMembers();
        
        // Notify parent component to refresh team data
        onTeamUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const updateTeamStatus = async (status: 'OPEN' | 'CLOSED') => {
    if (!team?.id) return;
    
    setActionLoading(`status-${status}`);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const result = await teamsService.setTeamStatus(team.id, status, user.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Notify parent component to refresh team data
        onTeamUpdate?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating team status:', error);
      toast({
        title: "Error",
        description: "Failed to update team status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [team?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-500';
      case 'FULL': return 'bg-yellow-500';
      case 'CLOSED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Unlock className="w-4 h-4" />;
      case 'FULL': return <UserCheck className="w-4 h-4" />;
      case 'CLOSED': return <Lock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {team.name}
            <div className="flex items-center gap-2 ml-2">
              <Badge variant={isLeader ? "default" : "secondary"}>
                {isLeader ? "Leader" : "Member"}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${getStatusColor(team.status)} text-white border-0`}
              >
                <span className="flex items-center gap-1">
                  {getStatusIcon(team.status)}
                  {team.status}
                </span>
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Team Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-muted-foreground text-sm">
                    {team.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{team.current_members}</span>
                      <span className="text-muted-foreground">/{team.max_members} Members</span>
                    </span>
                    {team.current_members >= team.max_members && (
                      <Badge variant="secondary" className="text-xs">FULL</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Created {new Date(team.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {team.skills_focus && team.skills_focus.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Skills Focus
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {team.skills_focus.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Members ({members.length})
              </h3>
              {isLeader && (
                <Button variant="outline" size="sm" onClick={fetchMembers}>
                  <Settings className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Loading members...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.profile?.display_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {member.profile?.display_name || 'Anonymous User'}
                          </span>
                          {member.role === 'leader' && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {member.role}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {member.profile?.email || 'No email'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {isLeader && member.role !== 'leader' && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={actionLoading === `remove-${member.user_id}`}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove <strong>{member.profile?.display_name}</strong> from the team? 
                              This action cannot be undone and will free up a slot for new members.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeMember(member.user_id, member.profile?.display_name || 'User')}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Remove Member
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team Actions */}
          {isLeader && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground mb-4">Team Management</h3>
                <div className="flex gap-2 flex-wrap">
                  {team.status !== 'CLOSED' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={actionLoading === 'status-CLOSED'}
                        >
                          <Lock className="w-4 h-4 mr-1" />
                          Close Team
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Close Team</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will prevent new members from joining the team. Current members will remain, 
                            but no new join requests will be accepted. You can reopen the team later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => updateTeamStatus('CLOSED')}>
                            Close Team
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  
                  {team.status === 'CLOSED' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateTeamStatus('OPEN')}
                      disabled={actionLoading === 'status-OPEN'}
                    >
                      <Unlock className="w-4 h-4 mr-1" />
                      Reopen Team
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" onClick={fetchMembers}>
                    <Users className="w-4 h-4 mr-1" />
                    Refresh Members
                  </Button>
                </div>
                
                {team.status === 'FULL' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Team is Full</span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                      Remove a member to make space for new join requests.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};