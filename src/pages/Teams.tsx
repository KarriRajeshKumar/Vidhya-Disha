import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
  Calendar, 
  CheckCircle,
  Clock,
  Users2,
  XCircle
} from "lucide-react";
import { useTeamsData } from "@/hooks/useTeamsData";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { JoinRequestDialog } from "@/components/teams/JoinRequestDialog";
import { TeamDetailsDialog } from "@/components/teams/TeamDetailsDialog";
import { useAuth } from "@/hooks/useAuth";

export default function Teams() {
  const [activeTab, setActiveTab] = useState("available");

  // Auto-refresh join requests when switching to requests tab
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "requests") {
      console.log('🔄 Switching to requests tab, refreshing data...');
      refetch();
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { 
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
    refetch 
  } = useTeamsData();

  // Filter available teams based on search query (only show OPEN teams)
  const filteredTeams = availableTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.skills_focus.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Check if user is already a member of a team
  const isUserMember = (teamId: string) => {
    return userTeams.some(team => team.id === teamId);
  };

  // Get team status badge styling
  const getStatusBadge = (team: any) => {
    const status = team.status || (team.current_members >= team.max_members ? 'FULL' : 'OPEN');
    
    switch (status) {
      case 'OPEN':
        return <Badge variant="outline" className="text-green-600 border-green-600">OPEN</Badge>;
      case 'FULL':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">FULL</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="text-red-600 border-red-600">CLOSED</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  const teamStats = [
    { title: "Teams Joined", value: userTeams.length.toString(), color: "text-info" },
    { title: "Teams Created", value: teams.filter(team => team.created_by === user?.id).length.toString(), color: "text-foreground" },
    { title: "Requests Pending", value: joinRequests.length.toString(), color: "text-warning" },
    { title: "Total Teams", value: teams.length.toString(), color: "text-success" }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Teams & Collaboration</h1>
            <p className="text-muted-foreground mt-2">
              Join or create teams to collaborate on projects and enhance your skills
            </p>
          </div>
          <CreateTeamDialog onTeamCreated={refetch} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="available">Available Teams</TabsTrigger>
            <TabsTrigger value="your-teams">Your Teams</TabsTrigger>
            <TabsTrigger value="requests">Join Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-8">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams by name, description, or required skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Available Teams Grid */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading teams...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTeams.map((team) => (
                  <Card key={team.id} className="bg-card border-border shadow-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-foreground">{team.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="capitalize">
                              {team.team_type.replace('_', ' ')}
                            </Badge>
                            {getStatusBadge(team)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{team.description || "No description provided"}</p>
                      
                      {/* Skills Focus */}
                      {team.skills_focus.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Skills Focus:</h4>
                          <div className="flex flex-wrap gap-1">
                            {team.skills_focus.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Team Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Members
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {team.current_members}/{team.max_members}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {new Date(team.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {isUserMember(team.id) ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Team Member
                        </Button>
                      ) : team.current_members >= team.max_members ? (
                        <Button variant="outline" className="w-full" disabled>
                          Team Full
                        </Button>
                      ) : team.status === 'CLOSED' ? (
                        <Button variant="outline" className="w-full" disabled>
                          <XCircle className="w-4 h-4 mr-2" />
                          Team Closed
                        </Button>
                      ) : !currentUser ? (
                        <Button variant="outline" className="w-full" disabled>
                          Login to Join
                        </Button>
                      ) : (
                        <JoinRequestDialog team={team} onJoinRequest={joinTeam}>
                          <Button className="w-full bg-primary hover:bg-primary/90">
                            Request to Join
                          </Button>
                        </JoinRequestDialog>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="your-teams" className="mt-8">
            {/* Your Teams Grid */}
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading your teams...</p>
              </div>
            ) : userTeams.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {userTeams.map((team) => (
                  <Card key={team.id} className="bg-card border-border shadow-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-foreground">{team.name}</CardTitle>
                          <Badge 
                            variant={team.created_by === user?.id ? "default" : "secondary"} 
                            className="mt-1 capitalize"
                          >
                            {team.created_by === user?.id ? "Leader" : "Member"}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {team.team_type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{team.description || "No description provided"}</p>
                      
                      {/* Skills Focus */}
                      {team.skills_focus.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">Skills Focus:</h4>
                          <div className="flex flex-wrap gap-1">
                            {team.skills_focus.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Team Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Members
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {team.current_members}/{team.max_members}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {new Date(team.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <TeamDetailsDialog 
                        team={team} 
                        isLeader={team.created_by === currentUser?.id}
                        onTeamUpdate={refetch}
                      >
                        <Button variant="outline" className="w-full">
                          View Team Details
                        </Button>
                      </TeamDetailsDialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border shadow-card mb-8">
                <CardContent className="p-8 text-center">
                  <Users2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Teams Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't joined any teams yet. Browse available teams or create your own!
                  </p>
                  <CreateTeamDialog onTeamCreated={refetch} />
                </CardContent>
              </Card>
            )}

            {/* Team Statistics */}
            <Card className="bg-card border-border shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users2 className="w-5 h-5 text-primary" />
                  Team Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.title}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Join Requests</h2>
                <p className="text-muted-foreground text-sm">
                  Manage join requests for teams you own
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('🔄 Manual refresh triggered');
                  refetch();
                }}
                disabled={loading}
              >
                <Clock className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading join requests...</p>
              </div>
            ) : joinRequests.length > 0 ? (
              <div className="space-y-4">
                {joinRequests.map((request) => (
                  <Card key={request.id} className="bg-card border-border shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground">
                              {request.profiles?.display_name || "Anonymous User"}
                            </h3>
                            <Badge 
                              variant={request.status === 'pending' ? 'secondary' : 
                                     request.status === 'accepted' ? 'default' : 'destructive'}
                              className="capitalize"
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Wants to join: <span className="text-foreground font-medium">{request.teams.name}</span>
                          </p>
                          
                          {request.message && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-foreground mb-1">Message:</p>
                              <div className="bg-secondary p-3 rounded-lg">
                                <p className="text-sm text-foreground">{request.message}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Requested {new Date(request.requested_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <Button 
                              onClick={() => handleJoinRequest(request.id, 'accept')}
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                              disabled={request.teams.current_members >= request.teams.max_members}
                            >
                              <CheckCircle className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleJoinRequest(request.id, 'reject')}
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </Button>
                          </div>
                        )}
                        
                        {request.teams.current_members >= request.teams.max_members && request.status === 'pending' && (
                          <div className="ml-4 mt-2">
                            <Badge variant="secondary" className="text-xs text-yellow-600">
                              Team Full - Cannot Accept
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border shadow-card">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Join Requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any pending team join requests at the moment.
                  </p>
                  
                  {/* Debug Info */}
                  <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-left">
                    <h4 className="text-sm font-medium text-foreground mb-2">Debug Info:</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Current User ID: {currentUser?.id || 'Not logged in'}</p>
                      <p>Teams You Own: {teams.filter(team => team.created_by === currentUser?.id).length}</p>
                      <p>Your Team Names: {teams.filter(team => team.created_by === currentUser?.id).map(t => t.name).join(', ') || 'None'}</p>
                      <p>Total Join Requests: {joinRequests.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}