"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import UserProfileModal from "@/components/profile/UserProfileModal";
import { BarChart3, CheckCircle2, Clock, Folder, Lightbulb, Sparkles, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  const { projects, tasks, users, currentUser, isLoading } = useApp();
  const [profileUser, setProfileUser] = useState<number | null>(null);

  // GSAP Animations
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const insightsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) return;

    const tl = gsap.timeline();

    if (headerRef.current) {
      tl.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }

    if (statsRef.current) {
      tl.fromTo(statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)' },
        '-=0.3'
      );
    }

    if (insightsRef.current) {
      tl.fromTo(insightsRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    }

    if (projectsRef.current) {
      tl.fromTo(projectsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
        '-=0.2'
      );
    }
  }, [isLoading]);

  const publicProjects = projects.filter(p => p.isPublic);

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Generate AI-like insights
  const generateInsights = () => {
    const insights = [];

    if (completionRate >= 75) {
      insights.push({ type: 'success', icon: '🌟', text: `Great job! ${completionRate}% task completion rate this week.` });
    } else if (completionRate >= 50) {
      insights.push({ type: 'info', icon: '📊', text: `You're at ${completionRate}% completion. Push a bit more!` });
    } else {
      insights.push({ type: 'warning', icon: '⚡', text: `Focus time! Only ${completionRate}% tasks completed.` });
    }

    if (inProgressTasks > 5) {
      insights.push({ type: 'warning', icon: '⏰', text: `${inProgressTasks} tasks in progress. Consider finishing some first.` });
    }

    if (currentUser) {
      insights.push({ type: 'info', icon: '👋', text: `Welcome back, ${currentUser.name.split(' ')[0]}!` });
    }

    return insights;
  };

  const insights = generateInsights();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {profileUser !== null && (
        <UserProfileModal
          open={profileUser !== null}
          onClose={() => setProfileUser(null)}
          userId={profileUser}
        />
      )}

      {/* Header */}
      <div ref={headerRef}>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            Dashboard
          </span>
          <Badge variant="secondary" className="text-xs font-normal">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </h1>
        <p className="text-muted-foreground mt-1">Your workspace at a glance</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Folder className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-amber-600">{inProgressTasks}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-3xl font-bold text-purple-600">{users.length}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card ref={insightsRef} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Productivity Insights
          </CardTitle>
          <CardDescription className="text-white/80">
            Smart suggestions to boost your productivity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <span className="text-2xl">{insight.icon}</span>
                <p className="text-sm">{insight.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Active Projects
        </h2>
        <div ref={projectsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {publicProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col h-full cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg font-medium">{project.title}</CardTitle>
                <div className="flex -space-x-2">
                  <TooltipProvider>
                    {project.members.slice(0, 3).map(member => (
                      <Tooltip key={member.id}>
                        <TooltipTrigger asChild>
                          <Avatar className="border-2 border-card hover:ring-2 hover:ring-primary transition-all cursor-pointer h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/32?u=${member.id}`} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{member.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {project.members.length > 3 && (
                      <Avatar className="border-2 border-card h-8 w-8">
                        <AvatarFallback className="text-xs">+{project.members.length - 3}</AvatarFallback>
                      </Avatar>
                    )}
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow justify-end">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
