import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/lms/Navbar';
import ProgressBar from '@/components/lms/ProgressBar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock, User, CheckCircle2, Circle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Course, Session } from '@/types/lms';

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const { data: c } = await supabase.from('courses').select('*').eq('id', id).single();
      if (c) setCourse({ ...c, difficulty: c.difficulty as Course['difficulty'] });

      const { data: s } = await supabase.from('sessions').select('*').eq('course_id', id).order('order_index');
      setSessions(s || []);

      if (user) {
        const { data: enrollment } = await supabase
          .from('enrollments').select('id').eq('user_id', user.id).eq('course_id', id).maybeSingle();
        setEnrolled(!!enrollment);

        const { data: progress } = await supabase
          .from('progress').select('session_id').eq('user_id', user.id).eq('course_id', id).eq('completed', true);
        setCompletedIds(new Set((progress || []).map(p => p.session_id)));
      }
      setLoading(false);
    };
    fetch();
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    if (!id) return;
    const { error } = await supabase.from('enrollments').insert({ user_id: user.id, course_id: id });
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    setEnrolled(true);
    toast({ title: 'Enrolled!', description: 'You can now start watching sessions.' });
  };

  const progress = sessions.length ? (completedIds.size / sessions.length) * 100 : 0;

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-24 text-center text-muted-foreground">Course not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">{course.difficulty}</Badge>
              <Badge variant="secondary">{course.category}</Badge>
            </div>
            <h1 className="mb-4 font-heading text-3xl font-bold md:text-4xl">{course.title}</h1>
            <p className="mb-6 text-muted-foreground">{course.description}</p>

            {/* Instructor */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold">{course.instructor_name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor_bio}</p>
              </div>
            </div>

            {enrolled && <ProgressBar value={progress} className="mb-6 max-w-md" />}

            {!enrolled && (
              <Button size="lg" className="gradient-primary text-primary-foreground" onClick={handleEnroll}>
                Enroll in Course
              </Button>
            )}
          </div>
          <div className="overflow-hidden rounded-xl">
            <img src={course.thumbnail_url || '/placeholder.svg'} alt={course.title}
              className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Sessions */}
        <h2 className="mb-4 font-heading text-xl font-semibold">Sessions ({sessions.length})</h2>
        <div className="space-y-3">
          {sessions.map((session, i) => {
            const isCompleted = completedIds.has(session.id);
            return (
              <Card key={session.id} className="transition-all hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{session.title}</h3>
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-success" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.description}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {session.duration_minutes}m</span>
                    {enrolled ? (
                      <Link to={`/courses/${id}/session/${session.id}`}>
                        <Button size="sm" variant={isCompleted ? 'outline' : 'default'} className={isCompleted ? '' : 'gradient-primary text-primary-foreground'}>
                          <Play className="mr-1 h-3.5 w-3.5" /> {isCompleted ? 'Rewatch' : 'Watch'}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Play className="mr-1 h-3.5 w-3.5" /> Enroll to watch
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
