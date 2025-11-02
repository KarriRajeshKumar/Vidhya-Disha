import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreateTeamDialogProps {
  onTeamCreated: () => void;
}

export function CreateTeamDialog({ onTeamCreated }: CreateTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamType: "study_group",
    maxMembers: 10,
    skillsFocus: [] as string[],
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error", 
          description: "You must be logged in to create a team",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          description: formData.description,
          team_type: formData.teamType,
          max_members: formData.maxMembers,
          skills_focus: formData.skillsFocus,
          created_by: user.id,
          current_members: 1, // Creator is automatically a member
        });

      if (error) throw error;

      // Add creator as team member
      const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('name', formData.name)
        .eq('created_by', user.id)
        .single();

      if (team) {
        await supabase
          .from('team_members')
          .insert({
            team_id: team.id,
            user_id: user.id,
            role: 'leader',
          });
      }

      toast({
        title: "Success",
        description: "Team created successfully!",
      });

      setFormData({
        name: "",
        description: "",
        teamType: "study_group",
        maxMembers: 10,
        skillsFocus: [],
      });
      setOpen(false);
      onTeamCreated();
    } catch (error) {
      console.error('Error creating team:', error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skillsFocus.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skillsFocus: [...formData.skillsFocus, currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skillsFocus: formData.skillsFocus.filter(skill => skill !== skillToRemove),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Set up a new team for collaboration and skill development.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter team name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your team's purpose and goals"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="teamType">Team Type</Label>
              <Select value={formData.teamType} onValueChange={(value) => setFormData({ ...formData, teamType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="study_group">Study Group</SelectItem>
                  <SelectItem value="project_team">Project Team</SelectItem>
                  <SelectItem value="hackathon">Hackathon Team</SelectItem>
                  <SelectItem value="research">Research Team</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxMembers">Max Members</Label>
              <Input
                id="maxMembers"
                type="number"
                min="2"
                max="20"
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) || 10 })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Skills Focus</Label>
              <div className="flex gap-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" variant="outline" onClick={addSkill}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.skillsFocus.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}