'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Video, Plus, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

// Mock meetings data
const mockMeetings = [
    {
        id: '1',
        title: 'Sprint Planning',
        description: 'Plan tasks for the next sprint',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        location: 'Zoom',
        link: 'https://zoom.us/j/123456',
        organizer: { name: 'Alice Carter' },
        attendees: [{ name: 'Brian Lee' }, { name: 'David Kim' }],
    },
    {
        id: '2',
        title: 'Design Review',
        description: 'Review new UI mockups',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
        location: 'Office - Room 3',
        organizer: { name: 'Chloe Patel' },
        attendees: [{ name: 'Alice Carter' }, { name: 'Brian Lee' }],
    },
    {
        id: '3',
        title: 'Team Stand-up',
        description: 'Daily sync',
        startTime: new Date(Date.now() + 172800000).toISOString(),
        endTime: new Date(Date.now() + 174600000).toISOString(),
        location: 'Google Meet',
        link: 'https://meet.google.com/abc-xyz',
        organizer: { name: 'Alice Carter' },
        attendees: [{ name: 'Everyone' }],
    },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MeetingsPage() {
    const { users, currentUser } = useApp();
    const [meetings, setMeetings] = useState(mockMeetings);
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        link: '',
    });

    const handleCreateMeeting = () => {
        if (!formData.title || !formData.startTime || !formData.endTime) {
            toast.error('Please fill in required fields');
            return;
        }

        const newMeeting = {
            id: Date.now().toString(),
            ...formData,
            organizer: { name: currentUser?.name || 'You' },
            attendees: [],
        };

        setMeetings([newMeeting, ...meetings]);
        setFormData({ title: '', description: '', startTime: '', endTime: '', location: '', link: '' });
        setIsOpen(false);
        toast.success('Meeting scheduled! 📅');
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        return { daysInMonth, startingDay };
    };

    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                        <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Meetings</h1>
                        <p className="text-muted-foreground">Schedule and manage team meetings</p>
                    </div>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            <Plus className="mr-2 h-4 w-4" />
                            New Meeting
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Schedule a Meeting</DialogTitle>
                            <DialogDescription>Create a new meeting invite</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Meeting Title *</Label>
                                <Input
                                    placeholder="Team Sync"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time *</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time *</Label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    placeholder="Zoom, Google Meet, Office Room..."
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meeting Link</Label>
                                <Input
                                    placeholder="https://..."
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="What's this meeting about?"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <Button onClick={handleCreateMeeting} className="w-full">
                                Schedule Meeting
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {currentMonth.toLocaleDateString([], { month: 'long', year: 'numeric' })}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                            {DAYS.map((day) => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                            {Array.from({ length: startingDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const isToday =
                                    day === new Date().getDate() &&
                                    currentMonth.getMonth() === new Date().getMonth() &&
                                    currentMonth.getFullYear() === new Date().getFullYear();

                                return (
                                    <motion.div
                                        key={day}
                                        whileHover={{ scale: 1.05 }}
                                        className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-colors ${isToday
                                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold'
                                                : 'hover:bg-muted'
                                            }`}
                                    >
                                        {day}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming Meetings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-500" />
                            Upcoming
                        </CardTitle>
                        <CardDescription>Your next meetings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {meetings.slice(0, 5).map((meeting, index) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border border-blue-100 dark:border-blue-900"
                            >
                                <h4 className="font-semibold">{meeting.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(meeting.startTime)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                                </div>
                                {meeting.location && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        {meeting.link ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                                        {meeting.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mt-3">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex -space-x-2">
                                        {meeting.attendees.slice(0, 3).map((att, i) => (
                                            <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                                <AvatarFallback className="text-xs">{att.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                                {meeting.link && (
                                    <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                                        <a href={meeting.link} target="_blank" rel="noopener noreferrer">
                                            <Video className="mr-2 h-4 w-4" />
                                            Join Meeting
                                        </a>
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
