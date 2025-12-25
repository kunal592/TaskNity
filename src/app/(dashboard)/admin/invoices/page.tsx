"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, FileText, MoreHorizontal, Download, Eye } from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const invoices = [
    { id: '1', number: 'INV-2025-4821', client: 'Acme Corp', date: '2025-10-24', amount: 1250.00, status: 'PAID' },
    { id: '2', number: 'INV-2025-9923', client: 'Globex Inc', date: '2025-10-28', amount: 3400.50, status: 'PENDING' },
    { id: '3', number: 'INV-2025-1102', client: 'Soylent Corp', date: '2025-11-01', amount: 850.00, status: 'OVERDUE' },
    { id: '4', number: 'INV-2025-5511', client: 'Initech', date: '2025-11-05', amount: 2100.00, status: 'DRAFT' },
    { id: '5', number: 'INV-2025-3321', client: 'Umbrella Corp', date: '2025-11-10', amount: 5000.00, status: 'PENDING' },
];

const statusColors: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    OVERDUE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    DRAFT: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function InvoicesPage() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Invoices
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage, create, and track invoices for your clients.</p>
                </div>
                <Link href="/admin/invoices/create">
                    <Button className="bg-primary hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Create Invoice
                    </Button>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <span className="text-muted-foreground"><FileText size={16} /></span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <span className="text-yellow-500"><FileText size={16} /></span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,340.00</div>
                        <p className="text-xs text-muted-foreground">5 invoices pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                        <span className="text-red-500"><FileText size={16} /></span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2,300.00</div>
                        <p className="text-xs text-muted-foreground">2 invoices overdue</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <span className="text-gray-500"><FileText size={16} /></span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">Invoices in draft</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search invoices..." className="pl-9 bg-background" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                    <Button variant="outline">Export</Button>
                </div>
            </div>

            {/* List */}
            <Card>
                <CardContent className="p-0">
                    <div className="rounded-md border-0">
                        <div className="w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm text-left">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Invoice #</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Client</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Amount</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-center">Status</th>
                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {invoices.map((invoice, i) => (
                                        <motion.tr
                                            key={invoice.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle font-medium">{invoice.number}</td>
                                            <td className="p-4 align-middle">{invoice.client}</td>
                                            <td className="p-4 align-middle">{invoice.date}</td>
                                            <td className="p-4 align-middle text-right">${invoice.amount.toFixed(2)}</td>
                                            <td className="p-4 align-middle text-center">
                                                <Badge variant="outline" className={`border-0 ${statusColors[invoice.status]}`}>
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Download className="mr-2 h-4 w-4" /> Download PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
