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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, Users, Wallet, Plus, Download, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';

// Mock payroll data
const mockPayroll = [
    { id: '1', name: 'Alice Carter', role: 'Admin', team: 'Core', baseSalary: 85000, bonus: 5000, deductions: 8500, netSalary: 81500, status: 'Paid' },
    { id: '2', name: 'Brian Lee', role: 'Member', team: 'Frontend', baseSalary: 72000, bonus: 3000, deductions: 7200, netSalary: 67800, status: 'Paid' },
    { id: '3', name: 'David Kim', role: 'Member', team: 'Backend', baseSalary: 78000, bonus: 4000, deductions: 7800, netSalary: 74200, status: 'Pending' },
    { id: '4', name: 'Chloe Patel', role: 'Viewer', team: 'Design', baseSalary: 68000, bonus: 2000, deductions: 6800, netSalary: 63200, status: 'Paid' },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function PayrollPage() {
    const { roleAccess } = useApp();
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [payroll, setPayroll] = useState(mockPayroll);
    const [isOpen, setIsOpen] = useState(false);

    // GSAP Animations
    const headerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
                '-=0.3'
            );
        }

        if (tableRef.current) {
            tl.fromTo(tableRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '-=0.2'
            );
        }
    }, []);

    const totalSalary = payroll.reduce((sum, p) => sum + p.netSalary, 0);
    const totalBonuses = payroll.reduce((sum, p) => sum + p.bonus, 0);
    const avgSalary = Math.round(totalSalary / payroll.length);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    if (!roleAccess.canManageTeam) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">You don&apos;t have access to this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div ref={headerRef} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                        <DollarSign className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Payroll Management</h1>
                        <p className="text-muted-foreground">Track salaries, bonuses and deductions</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {MONTHS.map((month, i) => (
                                <SelectItem key={i} value={i.toString()}>{month}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div ref={statsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Total Payroll
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">{formatCurrency(totalSalary)}</p>
                        <p className="text-sm text-muted-foreground">This month</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Total Bonuses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalBonuses)}</p>
                        <p className="text-sm text-muted-foreground">Performance bonuses</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Average Salary
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">{formatCurrency(avgSalary)}</p>
                        <p className="text-sm text-muted-foreground">Per employee</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Employees
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-600">{payroll.length}</p>
                        <p className="text-sm text-muted-foreground">Active on payroll</p>
                    </CardContent>
                </Card>
            </div>

            {/* Payroll Table */}
            <Card ref={tableRef}>
                <CardHeader>
                    <CardTitle>Payroll for {MONTHS[parseInt(selectedMonth)]} 2024</CardTitle>
                    <CardDescription>Salary breakdown for all employees</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Team</TableHead>
                                <TableHead className="text-right">Base Salary</TableHead>
                                <TableHead className="text-right">Bonus</TableHead>
                                <TableHead className="text-right">Deductions</TableHead>
                                <TableHead className="text-right">Net Salary</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payroll.map((employee, index) => (
                                <TableRow
                                    key={employee.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <TableCell className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={`https://i.pravatar.cc/40?u=${employee.id}`} />
                                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{employee.name}</p>
                                            <p className="text-xs text-muted-foreground">{employee.role}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{employee.team}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(employee.baseSalary)}</TableCell>
                                    <TableCell className="text-right text-green-600">+{formatCurrency(employee.bonus)}</TableCell>
                                    <TableCell className="text-right text-red-600">-{formatCurrency(employee.deductions)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(employee.netSalary)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={employee.status === 'Paid' ? 'default' : 'secondary'}>
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
