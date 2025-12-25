'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    BookOpen, Rocket, Users, CheckCircle, Calendar, MessageCircle,
    Heart, Folder, BarChart2, CreditCard, Shield, ChevronRight,
    Play, Sparkles, Target, Zap, HelpCircle, Lightbulb
} from 'lucide-react';

const FEATURES = [
    {
        icon: <CheckCircle className="h-6 w-6" />,
        title: 'Task Management',
        description: 'Create, assign, and track tasks with our Kanban board. Drag and drop to update status.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: 'Team Collaboration',
        description: 'Work together with real-time updates, comments, and team member assignments.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: <Calendar className="h-6 w-6" />,
        title: 'Meeting Scheduler',
        description: 'Schedule meetings, set reminders, and view upcoming events on your calendar.',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: <MessageCircle className="h-6 w-6" />,
        title: 'Team Chat',
        description: 'Communicate with channels and direct messages. Share files and stay connected.',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: <Heart className="h-6 w-6" />,
        title: 'Kudos & Recognition',
        description: 'Give shoutouts to teammates. Build a positive culture with appreciation.',
        color: 'from-rose-500 to-red-500',
    },
    {
        icon: <Folder className="h-6 w-6" />,
        title: 'Document Management',
        description: 'Upload, organize, and share files. Keep all your documents in one place.',
        color: 'from-teal-500 to-cyan-500',
    },
];

const QUICK_START_STEPS = [
    {
        step: 1,
        title: 'Explore Your Dashboard',
        description: 'Your dashboard shows an overview of projects, tasks, and AI-powered productivity insights.',
        action: 'Go to Dashboard',
        href: '/',
    },
    {
        step: 2,
        title: 'Create Your First Task',
        description: 'Navigate to Tasks and click "New Task". Fill in details and assign team members.',
        action: 'Create Task',
        href: '/tasks',
    },
    {
        step: 3,
        title: 'Set Up a Project',
        description: 'Go to Projects to create or view existing projects. Add team members and set goals.',
        action: 'View Projects',
        href: '/projects',
    },
    {
        step: 4,
        title: 'Schedule a Meeting',
        description: 'Use the Meetings page to schedule team syncs and add participants.',
        action: 'Schedule Meeting',
        href: '/meetings',
    },
    {
        step: 5,
        title: 'Give Kudos',
        description: 'Recognize a teammate by sending them a shoutout on the Kudos page.',
        action: 'Send Kudos',
        href: '/kudos',
    },
];

const ROLE_PERMISSIONS = [
    {
        role: 'Owner',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        permissions: ['Full system access', 'Manage all users', 'View all analytics', 'Access classified data', 'Manage billing & payroll'],
    },
    {
        role: 'Admin',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        permissions: ['Manage projects', 'Manage team members', 'View analytics', 'Approve expenses', 'Access most features'],
    },
    {
        role: 'Member',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        permissions: ['View and update tasks', 'Work on assigned projects', 'Mark attendance', 'Request leaves', 'Use chat and meetings'],
    },
    {
        role: 'Viewer',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        permissions: ['View projects and tasks', 'View analytics', 'Limited editing access', 'Read-only for most features'],
    },
];

const FAQS = [
    {
        question: 'How do I change my profile information?',
        answer: 'Go to the Profile page from the sidebar. Click on your avatar or the edit button to update your name, email, phone, and other details.',
    },
    {
        question: 'How do I request time off?',
        answer: 'Click the "Request Leave" button in the top-right corner of any page. Fill in the dates and reason, then submit for approval.',
    },
    {
        question: 'Can I track my expenses?',
        answer: 'Yes! Go to Expenses (or My Requests for regular members) to submit expense claims. Admins can approve or reject requests.',
    },
    {
        question: 'How does the Kanban board work?',
        answer: 'The Tasks page shows a Kanban board with columns: To Do, In Progress, and Done. Drag tasks between columns to update their status.',
    },
    {
        question: 'What are AI Insights?',
        answer: 'AI Insights on the dashboard provide smart productivity tips based on your task completion rate, workload, and team activity.',
    },
    {
        question: 'How do I upload documents?',
        answer: 'Go to Documents page, then drag and drop files onto the upload zone or click the Upload button to select files.',
    },
];

export default function GuidePage() {
    const headerRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        if (headerRef.current) {
            tl.fromTo(headerRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );
        }

        if (featuresRef.current) {
            tl.fromTo(featuresRef.current.children,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)' },
                '-=0.3'
            );
        }
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div ref={headerRef} className="text-center py-8">
                <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New User Guide
                </Badge>
                <h1 className="text-4xl font-bold mb-4">
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                        TaskNity.Work
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Your all-in-one workspace for managing tasks, collaborating with your team,
                    and staying productive. Let&apos;s get you started!
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="quickstart" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="quickstart" className="flex items-center gap-2">
                        <Rocket className="h-4 w-4" />
                        Quick Start
                    </TabsTrigger>
                    <TabsTrigger value="features" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Features
                    </TabsTrigger>
                    <TabsTrigger value="roles" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Roles
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        FAQ
                    </TabsTrigger>
                </TabsList>

                {/* Quick Start Tab */}
                <TabsContent value="quickstart">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5 text-purple-500" />
                                Get Started in 5 Easy Steps
                            </CardTitle>
                            <CardDescription>
                                Follow these steps to set up your workspace and start being productive
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {QUICK_START_STEPS.map((item, index) => (
                                <div
                                    key={item.step}
                                    className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {item.step}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={item.href} className="flex items-center gap-1">
                                            {item.action}
                                            <ChevronRight className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Video Placeholder */}
                    <Card className="mt-6 overflow-hidden">
                        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white text-center">
                            <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                            <h3 className="text-xl font-semibold mb-2">Watch the Demo Video</h3>
                            <p className="text-white/80 mb-4">A 2-minute overview of all the features</p>
                            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                                <Play className="h-4 w-4 mr-2" />
                                Coming Soon
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features">
                    <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((feature) => (
                            <Card key={feature.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                                <CardContent className="pt-6">
                                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* More Features */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-amber-500" />
                                Pro Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span>Use keyboard shortcuts: Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">?</kbd> to see all shortcuts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span>Collapse the sidebar by clicking the panel icon for more screen space</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span>Check the AI Insights on your dashboard for productivity recommendations</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <span>Give kudos to teammates to boost team morale and recognition</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Roles Tab */}
                <TabsContent value="roles">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-500" />
                                Understanding Roles & Permissions
                            </CardTitle>
                            <CardDescription>
                                Each role has different access levels to features and data
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {ROLE_PERMISSIONS.map((role) => (
                                <div key={role.role} className="border rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Badge className={role.color}>{role.role}</Badge>
                                    </div>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {role.permissions.map((perm, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                {perm}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FAQ Tab */}
                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-orange-500" />
                                Frequently Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {FAQS.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card className="mt-6 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30">
                        <CardContent className="flex items-center justify-between py-6">
                            <div>
                                <h3 className="font-semibold text-lg">Still have questions?</h3>
                                <p className="text-muted-foreground">Our support team is here to help</p>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                                Contact Support
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
