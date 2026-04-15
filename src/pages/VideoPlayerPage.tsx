import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/lms/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactPlayer from 'react-player';
import type { Session as LmsSession } from '@/types/lms';

const VideoPlayerPage = () => {
  const { courseId, sessionId } = useParams<{ courseId: string; sessionId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [session, setSession] = useState<LmsSession | null>(null);
  const [allSessions, setAllSessions] = useState<LmsSession[]>([]);
  const [completed, setCompleted] = useState(false);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (!courseId || !sessionId) return;
    const fetch = async () => {
      const { data: s } = await supabase.from('sessions').select('*').eq('id', sessionId).single();
      if (s) setSession(s as LmsSession);

      const { data: all } = await supabase.from('sessions').select('*').eq('course_id', courseId).order('order_index');
      setAllSessions((all || []) as LmsSession[]);

      const { data: c } = await supabase.from('courses').select('title').eq('id', courseId).single();
      if (c) setCourseName(c.title);

      if (user) {
        const { data: p } = await supabase.from('progress')
          .select('completed').eq('user_id', user.id).eq('session_id', sessionId).maybeSingle();
        setCompleted(p?.completed || false);
      }
    };
    fetch();
  }, [courseId, sessionId, user]);

  const toggleComplete = async () => {
    if (!user || !sessionId || !courseId) return;
    if (completed) {
      await supabase.from('progress').delete().eq('user_id', user.id).eq('session_id', sessionId);
      setCompleted(false);
    } else {
      await supabase.from('progress').upsert({
        user_id: user.id, session_id: sessionId, course_id: courseId, completed: true, completed_at: new Date().toISOString()
      }, { onConflict: 'user_id,session_id' });
      setCompleted(true);
      toast({ title: 'Session completed! ✅' });
    }
  };

  const currentIndex = allSessions.findIndex(s => s.id === sessionId);
  const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null;
  const nextSession = currentIndex < allSessions.length - 1 ? allSessions[currentIndex + 1] : null;

  if (!session) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">Courses</Link>
          {' / '}
          <Link to={`/courses/${courseId}`} className="hover:text-foreground">{courseName}</Link>
          {' / '}
          <span className="text-foreground">{session.title}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video player */}
          <div className="lg:col-span-2">
            <div className="mb-4 overflow-hidden rounded-xl bg-foreground/5 aspect-video">
              <ReactPlayer
                url={session.youtube_url}
                width="100%"
                height="100%"
                controls
                playing={false}
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl font-bold">{session.title}</h1>
                <p className="mt-1 text-muted-foreground">{session.description}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {session.duration_minutes} minutes
                </div>
              </div>
              <Button
                variant={completed ? 'outline' : 'default'}
                className={completed ? 'border-success text-success' : 'gradient-primary text-primary-foreground'}
                onClick={toggleComplete}
              >
                {completed ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Circle className="mr-1 h-4 w-4" />}
                {completed ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              {prevSession ? (
                <Link to={`/courses/${courseId}/session/${prevSession.id}`}>
                  <Button variant="outline"><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
                </Link>
              ) : <div />}
              {nextSession ? (
                <Link to={`/courses/${courseId}/session/${nextSession.id}`}>
                  <Button className="gradient-primary text-primary-foreground">Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Session list sidebar */}
          <div>
            <h3 className="mb-3 font-heading text-lg font-semibold">All Sessions</h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {allSessions.map((s, i) => (
                <Link key={s.id} to={`/courses/${courseId}/session/${s.id}`}>
                  <Card className={`transition-all hover:shadow-sm ${s.id === sessionId ? 'border-primary bg-primary/5' : ''}`}>
                    <CardContent className="flex items-center gap-3 p-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{s.title}</p>
                        <p className="text-xs text-muted-foreground">{s.duration_minutes}m</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
