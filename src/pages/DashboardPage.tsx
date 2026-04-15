import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/lms/Navbar';
import CourseCard from '@/components/lms/CourseCard';
import ProgressBar from '@/components/lms/ProgressBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Award } from 'lucide-react';
import type { Course } from '@/types/lms';

const DashboardPage = () => {
  const { user, fullName } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<(Course & { progress: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('user_id', user.id);

      if (!enrollments?.length) { setLoading(false); return; }

      const courseIds = enrollments.map(e => e.course_id);
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);

      const { data: progress } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

      const { data: allSessions } = await supabase
        .from('sessions')
        .select('id, course_id')
        .in('course_id', courseIds);

      const enriched = (courses || []).map(c => {
        const totalSessions = (allSessions || []).filter(s => s.course_id === c.id).length;
        const completedSessions = (progress || []).filter(p => p.course_id === c.id).length;
        return { ...c, difficulty: c.difficulty as Course['difficulty'], progress: totalSessions ? (completedSessions / totalSessions) * 100 : 0 };
      });

      setEnrolledCourses(enriched);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const totalProgress = enrolledCourses.length
    ? enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length
    : 0;

  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Welcome back, {fullName || 'Student'}! 👋</h1>
          <p className="text-muted-foreground">Here's your learning overview</p>
        </div>

        {/* Stats cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg gradient-primary p-3"><BookOpen className="h-6 w-6 text-primary-foreground" /></div>
              <div>
                <p className="text-2xl font-bold font-heading">{enrolledCourses.length}</p>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg gradient-primary p-3"><TrendingUp className="h-6 w-6 text-primary-foreground" /></div>
              <div>
                <p className="text-2xl font-bold font-heading">{Math.round(totalProgress)}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg gradient-primary p-3"><Award className="h-6 w-6 text-primary-foreground" /></div>
              <div>
                <p className="text-2xl font-bold font-heading">{completedCourses}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enrolled courses */}
        <h2 className="mb-4 font-heading text-xl font-semibold">My Courses</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 font-heading text-lg font-semibold">No courses yet</h3>
              <p className="mb-4 text-muted-foreground">Start exploring and enroll in your first course!</p>
              <Link to="/courses" className="font-medium text-primary hover:underline">Browse Courses →</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map(course => (
              <div key={course.id}>
                <CourseCard course={course} />
                <ProgressBar value={course.progress} className="mt-2 px-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
