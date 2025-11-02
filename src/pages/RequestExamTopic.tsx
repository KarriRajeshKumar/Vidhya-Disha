import { useState } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { BookOpen, Send } from "lucide-react";

export default function RequestExamTopic() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      // For now, just show a success message
      // In a real app, this would save to database
      alert('Exam topic request submitted successfully! We will review your request.');
      navigate('/exams');
    } catch (err) {
      console.error('Failed to submit request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" />
            Request New Exam Topic
          </h1>
          <p className="text-muted-foreground mt-2">
            Can't find an exam for your interest? Request a new exam topic and we'll create it for you.
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Topic Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="topic">Exam Topic *</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Data Structures, Machine Learning, Web Development"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide more details about what you'd like to see in this exam..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || !topic.trim()} className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/exams')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-2">What happens next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Our team will review your request</li>
              <li>• We'll create dynamic questions using AI</li>
              <li>• The exam will be available in your personalized list</li>
              <li>• You'll receive a notification when it's ready</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}