'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Smile, Paperclip, Phone, Video, MoreVertical, Search, Users, Hash, Pin, AtSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';

// Mock chat data
const mockChannels = [
    { id: 'general', name: 'general', type: 'channel', unread: 2 },
    { id: 'engineering', name: 'engineering', type: 'channel', unread: 0 },
    { id: 'design', name: 'design', type: 'channel', unread: 5 },
    { id: 'random', name: 'random', type: 'channel', unread: 0 },
];

const mockDMs = [
    { id: 'dm1', name: 'Alice Carter', avatar: '1', online: true, unread: 1 },
    { id: 'dm2', name: 'Brian Lee', avatar: '2', online: true, unread: 0 },
    { id: 'dm3', name: 'Chloe Patel', avatar: '3', online: false, unread: 0 },
    { id: 'dm4', name: 'David Kim', avatar: '4', online: true, unread: 3 },
];

const mockMessages = [
    { id: '1', sender: 'Alice Carter', avatar: '1', message: 'Hey team! Just pushed the new dashboard updates 🚀', time: '10:30 AM', isOwn: false },
    { id: '2', sender: 'Brian Lee', avatar: '2', message: 'Looks great! The animations are smooth', time: '10:32 AM', isOwn: false },
    { id: '3', sender: 'You', avatar: '5', message: 'Thanks! Ill add a few more micro-interactions', time: '10:35 AM', isOwn: true },
    { id: '4', sender: 'Chloe Patel', avatar: '3', message: 'Love the new color scheme! Can we also update the login page?', time: '10:38 AM', isOwn: false },
    { id: '5', sender: 'David Kim', avatar: '4', message: 'Already on it! Should be done by EOD', time: '10:40 AM', isOwn: false },
    { id: '6', sender: 'Alice Carter', avatar: '1', message: 'Perfect! Lets sync at 3pm to review everything', time: '10:42 AM', isOwn: false },
];

export default function ChatPage() {
    const { currentUser, users } = useApp();
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // GSAP Animations
    const sidebarRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        if (sidebarRef.current) {
            tl.fromTo(sidebarRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
            );
        }

        if (chatRef.current) {
            tl.fromTo(chatRef.current,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
                '-=0.3'
            );
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now().toString(),
            sender: 'You',
            avatar: '5',
            message: newMessage.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true,
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Animate new message
        setTimeout(() => {
            const lastMessage = document.querySelector(`[data-message-id="${msg.id}"]`);
            if (lastMessage) {
                gsap.fromTo(lastMessage,
                    { opacity: 0, y: 20, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
                );
            }
        }, 0);
    };

    return (
        <div className="h-[calc(100vh-12rem)] flex gap-4">
            {/* Sidebar */}
            <Card ref={sidebarRef} className="w-72 flex flex-col">
                <CardHeader className="pb-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-4">
                        {/* Channels */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Channels</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <span className="text-lg">+</span>
                                </Button>
                            </div>
                            {mockChannels.map((channel) => (
                                <div
                                    key={channel.id}
                                    onClick={() => setActiveChannel(channel.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeChannel === channel.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted'
                                        }`}
                                >
                                    <Hash className="h-4 w-4" />
                                    <span className="flex-1">{channel.name}</span>
                                    {channel.unread > 0 && (
                                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                            {channel.unread}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Direct Messages */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-muted-foreground uppercase">Direct Messages</span>
                            </div>
                            {mockDMs.map((dm) => (
                                <div
                                    key={dm.id}
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                                >
                                    <div className="relative">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://i.pravatar.cc/32?u=${dm.avatar}`} />
                                            <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {dm.online && (
                                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                                        )}
                                    </div>
                                    <span className="flex-1 text-sm">{dm.name}</span>
                                    {dm.unread > 0 && (
                                        <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                            {dm.unread}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Chat Area */}
            <Card ref={chatRef} className="flex-1 flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Hash className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-lg">{activeChannel}</CardTitle>
                            <Badge variant="secondary" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {users.length} members
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Pin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    data-message-id={msg.id}
                                    className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                                >
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarImage src={`https://i.pravatar.cc/36?u=${msg.avatar}`} />
                                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className={`max-w-[70%] ${msg.isOwn ? 'items-end' : ''}`}>
                                        <div className={`flex items-center gap-2 mb-1 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                                            <span className="font-medium text-sm">{msg.sender}</span>
                                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                                        </div>
                                        <div
                                            className={`px-4 py-2 rounded-2xl ${msg.isOwn
                                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                    : 'bg-muted rounded-tl-sm'
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input
                            placeholder={`Message #${activeChannel}`}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                        />
                        <Button variant="ghost" size="icon">
                            <AtSign className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Smile className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={handleSendMessage}
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
