"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Download, Save, ArrowLeft, Printer } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '@/context/AuthContext';

// Types
interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    issueDate: string;
    dueDate: string;
    items: InvoiceItem[];
    taxRate: number;
    discount: number;
    notes: string;
}

export default function CreateInvoicePage() {
    const router = useRouter();
    const { user } = useAuth();
    const previewRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Initial State
    const [data, setData] = useState<InvoiceData>({
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
            { id: '1', description: 'Web Development Services', quantity: 1, unitPrice: 100, amount: 100 }
        ],
        taxRate: 10,
        discount: 0,
        notes: 'Thank you for your business!'
    });

    // Calculations
    const subTotal = data.items.reduce((acc, item) => acc + item.amount, 0);
    const taxAmount = (subTotal * data.taxRate) / 100;
    const totalAmount = subTotal + taxAmount - data.discount;

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
        setData(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'unitPrice') {
                        updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
                    }
                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const addItem = () => {
        setData(prev => ({
            ...prev,
            items: [...prev.items, {
                id: Math.random().toString(36).substr(2, 9),
                description: '',
                quantity: 1,
                unitPrice: 0,
                amount: 0
            }]
        }));
    };

    const removeItem = (id: string) => {
        if (data.items.length === 1) return;
        setData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.id !== id)
        }));
    };

    const handleDownloadPDF = async () => {
        if (!previewRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${data.invoiceNumber}.pdf`);
            toast.success("Invoice downloaded successfully!");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate PDF");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveInvoice = async () => {
        setIsGenerating(true);
        // TODO: Connect to backend API
        // await api.post('/invoices', { ...data, subTotal, taxAmount, totalAmount });

        // Simulating API call
        setTimeout(() => {
            setIsGenerating(false);
            toast.success("Invoice saved to database!");
            router.push('/admin/invoices');
        }, 1000);
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent" onClick={() => router.back()}>
                            <ArrowLeft size={16} className="mr-1" /> Back
                        </Button>
                        <span>/</span>
                        <span>Admin</span>
                        <span>/</span>
                        <span>Invoices</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Invoice Generator
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.print()} disabled={isGenerating}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" onClick={handleDownloadPDF} disabled={isGenerating}>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button onClick={handleSaveInvoice} disabled={isGenerating} className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" /> Save Invoice
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Invoice Number</Label>
                                    <Input name="invoiceNumber" value={data.invoiceNumber} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Issue Date</Label>
                                    <Input type="date" name="issueDate" value={data.issueDate} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input type="date" name="dueDate" value={data.dueDate} onChange={handleInputChange} />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-semibold">Client Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input name="clientName" placeholder="e.g. Acme Corp" value={data.clientName} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Client Email</Label>
                                        <Input name="clientEmail" placeholder="billing@acme.com" value={data.clientEmail} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Address</Label>
                                        <Textarea name="clientAddress" placeholder="123 Business Rd..." value={data.clientAddress} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Line Items</CardTitle>
                            <Button size="sm" variant="outline" onClick={addItem}>
                                <Plus className="h-4 w-4 mr-1" /> Add Item
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.items.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-2 items-end border-b pb-4 last:border-0 last:pb-0">
                                    <div className="col-span-5 space-y-1">
                                        <Label className="text-xs">Description</Label>
                                        <Input
                                            value={item.description}
                                            onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                            placeholder="Item description"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-xs">Qty</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-3 space-y-1">
                                        <Label className="text-xs">Price</Label>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="col-span-2 flex items-center gap-2">
                                        <div className="flex-1 text-right font-medium text-sm pt-6">
                                            ${item.amount.toFixed(2)}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90 h-8 w-8 mb-0.5"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Totals & Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        name="taxRate"
                                        value={data.taxRate}
                                        onChange={(e) => setData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount ($)</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        name="discount"
                                        value={data.discount}
                                        onChange={(e) => setData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes / Payment Terms</Label>
                                <Textarea
                                    name="notes"
                                    value={data.notes}
                                    onChange={handleInputChange}
                                    placeholder="Additional notes..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview Column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="sticky top-6"
                >
                    <div className="bg-white text-black rounded-lg shadow-xl overflow-hidden border">
                        {/* INVOICE PREVIEW AREA - Scaled for A4-ish look */}
                        <div
                            ref={previewRef}
                            className="p-8 min-h-[800px] flex flex-col justify-between"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {/* Header */}
                            <div>
                                <div className="flex justify-between items-start border-b pb-8 mb-8">
                                    <div>
                                        <h2 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h2>
                                        <p className="text-gray-500 font-medium">#{data.invoiceNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-xl font-bold text-gray-900">TaskNity Inc.</h3>
                                        <p className="text-gray-500 text-sm">123 Tech Park<br />Silicon Valley, CA 94043<br />billing@tasknity.com</p>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Bill To</h4>
                                        <div className="text-gray-900">
                                            <p className="font-bold text-lg">{data.clientName || 'Client Name'}</p>
                                            <p className="whitespace-pre-wrap">{data.clientAddress || 'Client Address'}</p>
                                            <p>{data.clientEmail}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-right">
                                        <div>
                                            <h4 className="text-xs uppercase font-bold text-gray-400 mb-1">Issue Date</h4>
                                            <p className="font-medium text-gray-900">{data.issueDate}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase font-bold text-gray-400 mb-1">Due Date</h4>
                                            <p className="font-medium text-gray-900">{data.dueDate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <table className="w-full mb-8">
                                    <thead>
                                        <tr className="border-b-2 border-gray-900">
                                            <th className="text-left py-3 font-bold text-gray-900">Description</th>
                                            <th className="text-right py-3 font-bold text-gray-900 w-24">Qty</th>
                                            <th className="text-right py-3 font-bold text-gray-900 w-32">Price</th>
                                            <th className="text-right py-3 font-bold text-gray-900 w-32">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-200">
                                                <td className="py-4 text-gray-900">{item.description || 'Item description'}</td>
                                                <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                                                <td className="py-4 text-right text-gray-600">${item.unitPrice.toFixed(2)}</td>
                                                <td className="py-4 text-right text-gray-900 font-medium">${item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Totals */}
                                <div className="flex justify-end">
                                    <div className="w-64 space-y-3">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${subTotal.toFixed(2)}</span>
                                        </div>
                                        {data.taxRate > 0 && (
                                            <div className="flex justify-between text-gray-600">
                                                <span>Tax ({data.taxRate}%)</span>
                                                <span>${taxAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        {data.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Discount</span>
                                                <span>-${data.discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-3">
                                            <span>Total</span>
                                            <span>${totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="border-t pt-8 text-gray-500 text-sm">
                                <h4 className="font-bold text-gray-900 mb-2">Notes</h4>
                                <p>{data.notes}</p>
                                <div className="mt-8 text-center text-xs text-gray-400">
                                    <p>Thank you for your business!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-sm text-muted-foreground">
                        Preview updates automatically as you type
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
