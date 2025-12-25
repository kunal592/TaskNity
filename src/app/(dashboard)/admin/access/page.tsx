'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Users, Lock, Key, UserCog, Settings, Check, X, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

const PERMISSIONS = [
    { key: 'projects', label: 'Manage Projects', description: 'Create, edit, delete projects' },
    { key: 'tasks', label: 'Manage Tasks', description: 'Create, edit, assign tasks' },
    { key: 'team', label: 'Manage Team', description: 'Add, edit, remove team members' },
    { key: 'finance', label: 'View Finance', description: 'Access financial data and reports' },
    { key: 'classified', label: 'View Classified', description: 'Access classified tasks and data' },
    { key: 'settings', label: 'System Settings', description: 'Modify system configuration' },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
    Owner: ['projects', 'tasks', 'team', 'finance', 'classified', 'settings'],
    Admin: ['projects', 'tasks', 'team', 'finance', 'classified'],
    Member: ['projects', 'tasks'],
    Viewer: [],
};

export default function AccessManagementPage() {
    const { users, roleAccess } = useApp();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<Record<string, string[]>>({});

    // GSAP Animations
    const headerRef = useRef<HTMLDivElement>(null);
    const rolesRef = useRef<HTMLDivElement>(null);
    const usersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        if (headerRef.current) {
            tl.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }

        if (rolesRef.current) {
            tl.fromTo(rolesRef.current.children,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' },
                '-=0.3'
            );
        }

        if (usersRef.current) {
            tl.fromTo(usersRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                '-=0.2'
            );
        }
    }, []);

    const handleRoleChange = (userId: string, newRole: string) => {
        toast.success(`Role updated to ${newRole}`);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Owner': return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
            case 'Admin': return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
            case 'Member': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
            case 'Viewer': return 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
            default: return '';
        }
    };

    if (!roleAccess.canManageTeam) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">Access Denied</p>
                    <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div ref={headerRef} className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
                    <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Access Management</h1>
                    <p className="text-muted-foreground">Manage user roles and permissions</p>
                </div>
            </div>

            {/* Role Cards */}
            <div ref={rolesRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Owner', 'Admin', 'Member', 'Viewer'].map((role) => (
                    <Card key={role} className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 ${role === 'Owner' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                                role === 'Admin' ? 'bg-gradient-to-r from-purple-500 to-violet-500' :
                                    role === 'Member' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                        'bg-gray-300'
                            }`} />
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <UserCog className="h-5 w-5" />
                                {role}
                            </CardTitle>
                            <CardDescription>
                                {users.filter(u => u.role === role).length} users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {PERMISSIONS.map((perm) => (
                                    <div key={perm.key} className="flex items-center gap-2 text-sm">
                                        {ROLE_PERMISSIONS[role].includes(perm.key) ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-red-400" />
                                        )}
                                        <span className={ROLE_PERMISSIONS[role].includes(perm.key) ? '' : 'text-muted-foreground'}>
                                            {perm.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Users Table */}
            <Card ref={usersRef}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Team Members
                    </CardTitle>
                    <CardDescription>Modify user roles and access levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead>Current Role</TableHead>
                                <TableHead>Change Role</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://i.pravatar.cc/36?u=${user.id}`} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.team || '-'}</TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Owner">Owner</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Member">Member</SelectItem>
                                                <SelectItem value="Viewer">Viewer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                            Active
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <Key className="mr-2 h-4 w-4" />
                                                    Permissions
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Custom Permissions for {user.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Override default role permissions for this user
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    {PERMISSIONS.map((perm) => (
                                                        <div key={perm.key} className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">{perm.label}</p>
                                                                <p className="text-sm text-muted-foreground">{perm.description}</p>
                                                            </div>
                                                            <Switch
                                                                defaultChecked={ROLE_PERMISSIONS[user.role].includes(perm.key)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <Button className="w-full">Save Permissions</Button>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
                <CardContent className="flex items-center gap-4 py-4">
                    <AlertTriangle className="h-6 w-6 text-amber-600" />
                    <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">Security Notice</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                            Role changes are logged for audit purposes. Only Owners can modify Admin roles.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
