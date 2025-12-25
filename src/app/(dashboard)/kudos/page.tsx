'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Trophy, Sparkles, Send, Star, PartyPopper, ThumbsUp, Rocket } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

const EMOJI_OPTIONS = [
    { value: '🎉', label: 'Party', icon: PartyPopper },
    { value: '⭐', label: 'Star', icon: Star },
    { value: '🚀', label: 'Rocket', icon: Rocket },
    { value: '💪', label: 'Strong', icon: ThumbsUp },
    { value: '❤️', label: 'Heart', icon: Heart },
    { value: '✨', label: 'Sparkle', icon: Sparkles },
];

// Mock data for now - will be replaced with API
const mockKudos = [
    { id: '1', fromUser: { name: 'Alice Carter', team: 'Core' }, toUser: { name: 'Brian Lee', team: 'Frontend' }, message: 'Amazing work on the dashboard redesign!', emoji: '🚀', createdAt: new Date().toISOString() },
    { id: '2', fromUser: { name: 'David Kim', team: 'Backend' }, toUser: { name: 'Alice Carter', team: 'Core' }, message: 'Great leadership during the sprint!', emoji: '⭐', createdAt: new Date().toISOString() },
    { id: '3', fromUser: { name: 'Brian Lee', team: 'Frontend' }, toUser: { name: 'Chloe Patel', team: 'Design' }, message: 'Love the new icon set designs!', emoji: '❤️', createdAt: new Date().toISOString() },
];

const mockLeaderboard = [
    { id: '1', name: 'Alice Carter', team: 'Core', kudosCount: 15 },
    { id: '2', name: 'Brian Lee', team: 'Frontend', kudosCount: 12 },
    { id: '3', name: 'David Kim', team: 'Backend', kudosCount: 9 },
    { id: '4', name: 'Chloe Patel', team: 'Design', kudosCount: 7 },
];

export default function KudosPage() {
    const { users, currentUser } = useApp();
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('🎉');
    const [kudos, setKudos] = useState(mockKudos);

    const handleSendKudos = () => {
        if (!selectedUser || !message.trim()) {
            toast.error('Please select a team member and write a message');
            return;
        }

        const recipient = users.find(u => u.id === selectedUser);
        if (!recipient) return;

        const newKudo = {
            id: Date.now().toString(),
            fromUser: { name: currentUser?.name || 'You', team: currentUser?.team || '' },
            toUser: { name: recipient.name, team: recipient.team || '' },
            message: message.trim(),
            emoji: selectedEmoji,
            createdAt: new Date().toISOString(),
        };

        setKudos([newKudo, ...kudos]);
        setMessage('');
        setSelectedUser('');
        toast.success('Kudos sent! 🎉');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
                    <Heart className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Team Kudos</h1>
                    <p className="text-muted-foreground">Celebrate your teammates' achievements</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Send Kudos Card */}
                <Card className="lg:col-span-2 border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-purple-500" />
                            Give a Shoutout
                        </CardTitle>
                        <CardDescription>Recognize a teammate&apos;s great work</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Select Team Member</Label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a teammate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.filter(u => u.id !== currentUser?.id).map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name} ({user.team || 'No team'})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Pick an Emoji</Label>
                                <div className="flex gap-2">
                                    {EMOJI_OPTIONS.map((opt) => (
                                        <Button
                                            key={opt.value}
                                            variant={selectedEmoji === opt.value ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => setSelectedEmoji(opt.value)}
                                            className="text-xl"
                                        >
                                            {opt.value}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Your Message</Label>
                            <Input
                                placeholder="What did they do that was awesome?"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="bg-white dark:bg-gray-900"
                            />
                        </div>
                        <Button
                            onClick={handleSendKudos}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Send Kudos
                        </Button>
                    </CardContent>
                </Card>

                {/* Leaderboard */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Kudos Leaderboard
                        </CardTitle>
                        <CardDescription>Top appreciated team members</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {mockLeaderboard.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-900/60 rounded-lg"
                            >
                                <span className="text-2xl font-bold text-amber-600 w-8">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                </span>
                                <Avatar className="h-10 w-10 border-2 border-amber-300">
                                    <AvatarImage src={`https://i.pravatar.cc/40?u=${user.id}`} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">{user.team}</p>
                                </div>
                                <span className="text-lg font-bold text-amber-600">{user.kudosCount}</span>
                            </motion.div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Recent Kudos Feed */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Shoutouts</CardTitle>
                    <CardDescription>Latest kudos from the team</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {kudos.map((kudo, index) => (
                                <motion.div
                                    key={kudo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl"
                                >
                                    <span className="text-3xl">{kudo.emoji}</span>
                                    <div className="flex-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">{kudo.fromUser.name}</span>
                                            <span className="text-muted-foreground"> gave kudos to </span>
                                            <span className="font-semibold">{kudo.toUser.name}</span>
                                        </p>
                                        <p className="mt-1 text-base">&quot;{kudo.message}&quot;</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {new Date(kudo.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
