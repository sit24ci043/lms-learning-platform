import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/lms/Navbar';
import CourseCard from '@/components/lms/CourseCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Course } from '@/types/lms';

const difficulties = ['all', 'beginner', 'intermediate', 'advanced'] as const;

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      setCourses((data || []).map(c => ({ ...c, difficulty: c.difficulty as Course['difficulty'] })));
      setLoading(false);
    };
    fetch();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(courses.map(c => c.category))];
    return ['all', ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchDiff = difficulty === 'all' || c.difficulty === difficulty;
      const matchCat = category === 'all' || c.category === category;
      return matchSearch && matchDiff && matchCat;
    });
  }, [courses, search, difficulty, category]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">All Courses</h1>
          <p className="text-muted-foreground">Explore skill development sessions for engineering students</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground pt-1">Difficulty:</span>
            {difficulties.map(d => (
              <Badge key={d} variant={difficulty === d ? 'default' : 'outline'}
                className="cursor-pointer capitalize" onClick={() => setDifficulty(d)}>
                {d}
              </Badge>
            ))}
          </div>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground pt-1">Category:</span>
              {categories.map(c => (
                <Badge key={c} variant={category === c ? 'default' : 'outline'}
                  className="cursor-pointer capitalize" onClick={() => setCategory(c)}>
                  {c}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No courses found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
