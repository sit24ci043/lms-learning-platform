import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/lms/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, BookOpen, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseForm {
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  difficulty: string;
  instructor_name: string;
  instructor_bio: string;
  total_sessions: number;
}

interface SessionForm {
  title: string;
  description: string;
  youtube_url: string;
  order_index: number;
  duration_minutes: number;
}

const emptySessionForm: SessionForm = { title: '', description: '', youtube_url: '', order_index: 0, duration_minutes: 0 };

const emptyCourse: CourseForm = {
  title: '', description: '', thumbnail_url: '', category: 'General',
  difficulty: 'beginner', instructor_name: '', instructor_bio: '', total_sessions: 0
};

const AdminPage = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCourses: 0, totalEnrollments: 0, totalStudents: 0 });
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourse);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [sessionForm, setSessionForm] = useState<SessionForm>(emptySessionForm);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedCourseForSession, setSelectedCourseForSession] = useState<string>('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [editingSession, setEditingSession] = useState<string | null>(null);

  const fetchData = async () => {
    const { data: c } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses(c || []);

    const { count: enrollCount } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });
    setStats({
      totalCourses: c?.length || 0,
      totalEnrollments: enrollCount || 0,
      totalStudents: 0,
    });
  };

  const fetchSessions = async (courseId: string) => {
    const { data } = await supabase.from('sessions').select('*').eq('course_id', courseId).order('order_index');
    setSessions(data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const saveCourse = async () => {
    if (editingCourse) {
      const { error } = await supabase.from('courses').update(courseForm).eq('id', editingCourse);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Course updated' });
    } else {
      const { error } = await supabase.from('courses').insert(courseForm);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Course created' });
    }
    setCourseDialogOpen(false);
    setCourseForm(emptyCourse);
    setEditingCourse(null);
    fetchData();
  };

  const deleteCourse = async (id: string) => {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Course deleted' });
    fetchData();
  };

  const saveSession = async () => {
    if (!selectedCourseForSession) return;
    if (editingSession) {
      const { error } = await supabase.from('sessions').update(sessionForm).eq('id', editingSession);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Session updated' });
    } else {
      const { error } = await supabase.from('sessions').insert({ ...sessionForm, course_id: selectedCourseForSession });
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Session created' });
      // Update total_sessions
      const { count } = await supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('course_id', selectedCourseForSession);
      await supabase.from('courses').update({ total_sessions: count || 0 }).eq('id', selectedCourseForSession);
    }
    setSessionDialogOpen(false);
    setSessionForm(emptySessionForm);
    setEditingSession(null);
    fetchSessions(selectedCourseForSession);
    fetchData();
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Session deleted' });
    if (selectedCourseForSession) {
      fetchSessions(selectedCourseForSession);
      const { count } = await supabase.from('sessions').select('*', { count: 'exact', head: true }).eq('course_id', selectedCourseForSession);
      await supabase.from('courses').update({ total_sessions: count || 0 }).eq('id', selectedCourseForSession);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 font-heading text-3xl font-bold">Admin Panel</h1>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card><CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg gradient-primary p-3"><BookOpen className="h-6 w-6 text-primary-foreground" /></div>
            <div><p className="text-2xl font-bold font-heading">{stats.totalCourses}</p><p className="text-sm text-muted-foreground">Courses</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg gradient-primary p-3"><TrendingUp className="h-6 w-6 text-primary-foreground" /></div>
            <div><p className="text-2xl font-bold font-heading">{stats.totalEnrollments}</p><p className="text-sm text-muted-foreground">Enrollments</p></div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="font-heading text-xl font-semibold">Manage Courses</h2>
              <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground" onClick={() => { setCourseForm(emptyCourse); setEditingCourse(null); }}>
                    <Plus className="mr-1 h-4 w-4" /> Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>{editingCourse ? 'Edit Course' : 'Add Course'}</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Title</Label><Input value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} /></div>
                    <div><Label>Description</Label><Textarea value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} /></div>
                    <div><Label>Thumbnail URL</Label><Input value={courseForm.thumbnail_url} onChange={e => setCourseForm(f => ({ ...f, thumbnail_url: e.target.value }))} /></div>
                    <div><Label>Category</Label><Input value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))} /></div>
                    <div><Label>Difficulty</Label>
                      <Select value={courseForm.difficulty} onValueChange={v => setCourseForm(f => ({ ...f, difficulty: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Instructor Name</Label><Input value={courseForm.instructor_name} onChange={e => setCourseForm(f => ({ ...f, instructor_name: e.target.value }))} /></div>
                    <div><Label>Instructor Bio</Label><Input value={courseForm.instructor_bio} onChange={e => setCourseForm(f => ({ ...f, instructor_bio: e.target.value }))} /></div>
                    <Button onClick={saveCourse} className="w-full gradient-primary text-primary-foreground">
                      {editingCourse ? 'Update' : 'Create'} Course
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {courses.map(c => (
                <Card key={c.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">{c.title}</h3>
                      <p className="text-sm text-muted-foreground">{c.category} · {c.difficulty} · {c.total_sessions} sessions</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setCourseForm({
                          title: c.title, description: c.description, thumbnail_url: c.thumbnail_url || '',
                          category: c.category, difficulty: c.difficulty, instructor_name: c.instructor_name,
                          instructor_bio: c.instructor_bio || '', total_sessions: c.total_sessions,
                        });
                        setEditingCourse(c.id);
                        setCourseDialogOpen(true);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCourse(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-4">
            <div className="mb-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-heading text-xl font-semibold">Manage Sessions</h2>
                <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-primary-foreground" disabled={!selectedCourseForSession}
                      onClick={() => { setSessionForm(emptySessionForm); setEditingSession(null); }}>
                      <Plus className="mr-1 h-4 w-4" /> Add Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>{editingSession ? 'Edit Session' : 'Add Session'}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div><Label>Title</Label><Input value={sessionForm.title} onChange={e => setSessionForm(f => ({ ...f, title: e.target.value }))} /></div>
                      <div><Label>Description</Label><Textarea value={sessionForm.description} onChange={e => setSessionForm(f => ({ ...f, description: e.target.value }))} /></div>
                      <div><Label>YouTube URL</Label><Input value={sessionForm.youtube_url} onChange={e => setSessionForm(f => ({ ...f, youtube_url: e.target.value }))} placeholder="https://youtube.com/watch?v=..." /></div>
                      <div><Label>Order</Label><Input type="number" value={sessionForm.order_index} onChange={e => setSessionForm(f => ({ ...f, order_index: +e.target.value }))} /></div>
                      <div><Label>Duration (min)</Label><Input type="number" value={sessionForm.duration_minutes} onChange={e => setSessionForm(f => ({ ...f, duration_minutes: +e.target.value }))} /></div>
                      <Button onClick={saveSession} className="w-full gradient-primary text-primary-foreground">
                        {editingSession ? 'Update' : 'Create'} Session
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Select value={selectedCourseForSession} onValueChange={v => { setSelectedCourseForSession(v); fetchSessions(v); }}>
                <SelectTrigger><SelectValue placeholder="Select a course" /></SelectTrigger>
                <SelectContent>
                  {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {sessions.map(s => (
                <Card key={s.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">#{s.order_index} {s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.duration_minutes}m · {s.youtube_url}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setSessionForm({ title: s.title, description: s.description || '', youtube_url: s.youtube_url, order_index: s.order_index, duration_minutes: s.duration_minutes });
                        setEditingSession(s.id);
                        setSessionDialogOpen(true);
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSession(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
