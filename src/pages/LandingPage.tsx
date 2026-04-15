import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Award, Users, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Navbar from '@/components/lms/Navbar';

const features = [
  { icon: Play, title: 'Video Sessions', desc: 'Watch recorded skill development sessions at your own pace' },
  { icon: Target, title: 'Track Progress', desc: 'Monitor your learning journey with detailed progress tracking' },
  { icon: Award, title: 'Earn Completion', desc: 'Complete courses and track your achievements' },
  { icon: Users, title: 'Expert Instructors', desc: 'Learn from experienced engineering professionals' },
];

const stats = [
  { value: '50+', label: 'Courses' },
  { value: '500+', label: 'Video Sessions' },
  { value: '10K+', label: 'Students' },
  { value: '95%', label: 'Satisfaction' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero px-4 py-24 md:py-32">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, hsl(217, 91%, 60%, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(262, 83%, 58%, 0.2) 0%, transparent 50%)'
        }} />
        <div className="container relative mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Zap className="h-4 w-4" /> New courses added weekly
            </div>
            <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Level Up Your{' '}
              <span className="text-gradient">Engineering Skills</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/70 md:text-xl">
              Master in-demand engineering skills through curated video sessions. Track your progress, learn at your pace, and build expertise that matters.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary text-primary-foreground px-8 py-6 text-lg shadow-glow">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 bg-transparent px-8 py-6 text-lg text-primary-foreground hover:bg-primary-foreground/10">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-heading text-3xl font-bold text-gradient">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">Why SkillForge?</h2>
            <p className="text-muted-foreground">Everything you need to accelerate your engineering career</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex rounded-lg gradient-primary p-3">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-heading text-xl font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero px-4 py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="mb-8 text-primary-foreground/70">
            Join thousands of engineering students building real-world skills.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary px-8 py-6 text-lg text-primary-foreground shadow-glow">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 font-heading font-bold">
            <BookOpen className="h-5 w-5 text-primary" /> SkillForge
          </div>
          <p className="text-sm text-muted-foreground">© 2026 SkillForge. Built for learners.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
