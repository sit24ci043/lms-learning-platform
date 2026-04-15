export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor_name: string;
  instructor_bio: string;
  instructor_avatar?: string;
  total_sessions: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  course_id: string;
  title: string;
  description: string;
  youtube_url: string;
  order_index: number;
  duration_minutes: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  course?: Course;
}

export interface Progress {
  id: string;
  user_id: string;
  session_id: string;
  course_id: string;
  completed: boolean;
  completed_at?: string;
}
