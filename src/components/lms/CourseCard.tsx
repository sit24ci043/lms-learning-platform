import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen } from 'lucide-react';
import type { Course } from '@/types/lms';

const difficultyColor = {
  beginner: 'bg-success/10 text-success border-success/20',
  intermediate: 'bg-warning/10 text-warning border-warning/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group overflow-hidden border-border/50 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
        <div className="aspect-video overflow-hidden">
          <img
            src={course.thumbnail_url || '/placeholder.svg'}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className={difficultyColor[course.difficulty]}>
              {course.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">{course.category}</Badge>
          </div>
          <h3 className="mb-1 font-heading text-lg font-semibold leading-tight">{course.title}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {course.total_sessions} sessions
            </span>
            <span className="flex items-center gap-1">by {course.instructor_name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
