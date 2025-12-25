'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Image, FileSpreadsheet, FileVideo, Folder, Upload, Search, Grid, List, MoreVertical, Download, Trash2, Share2, Eye, Clock, HardDrive } from 'lucide-react';
import { useApp } from '@/context/AppContext';

// Mock files data
const mockFiles = [
    { id: '1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Alice Carter', uploadedAt: '2024-01-15', shared: true },
    { id: '2', name: 'Design Assets.zip', type: 'zip', size: '45 MB', uploadedBy: 'Chloe Patel', uploadedAt: '2024-01-14', shared: true },
    { id: '3', name: 'Q4 Report.xlsx', type: 'xlsx', size: '1.2 MB', uploadedBy: 'David Kim', uploadedAt: '2024-01-13', shared: false },
    { id: '4', name: 'Team Photo.jpg', type: 'image', size: '3.8 MB', uploadedBy: 'Brian Lee', uploadedAt: '2024-01-12', shared: true },
    { id: '5', name: 'Product Demo.mp4', type: 'video', size: '156 MB', uploadedBy: 'Alice Carter', uploadedAt: '2024-01-10', shared: true },
    { id: '6', name: 'Meeting Notes.docx', type: 'doc', size: '245 KB', uploadedBy: 'Brian Lee', uploadedAt: '2024-01-09', shared: false },
    { id: '7', name: 'Brand Guidelines.pdf', type: 'pdf', size: '8.2 MB', uploadedBy: 'Chloe Patel', uploadedAt: '2024-01-08', shared: true },
    { id: '8', name: 'API Documentation.md', type: 'doc', size: '125 KB', uploadedBy: 'David Kim', uploadedAt: '2024-01-07', shared: true },
];

const mockFolders = [
    { id: 'f1', name: 'Marketing', files: 12 },
    { id: 'f2', name: 'Engineering', files: 28 },
    { id: 'f3', name: 'Design Assets', files: 45 },
    { id: 'f4', name: 'Finance', files: 8 },
];

const getFileIcon = (type: string) => {
    switch (type) {
        case 'pdf':
        case 'doc':
            return <FileText className="h-10 w-10 text-blue-500" />;
        case 'image':
            return <Image className="h-10 w-10 text-green-500" />;
        case 'xlsx':
            return <FileSpreadsheet className="h-10 w-10 text-emerald-500" />;
        case 'video':
            return <FileVideo className="h-10 w-10 text-purple-500" />;
        default:
            return <FileText className="h-10 w-10 text-gray-500" />;
    }
};

export default function DocsPage() {
    const { currentUser } = useApp();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [files, setFiles] = useState(mockFiles);
    const [isDragging, setIsDragging] = useState(false);

    // GSAP Animations
    const headerRef = useRef<HTMLDivElement>(null);
    const foldersRef = useRef<HTMLDivElement>(null);
    const filesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline();

        if (headerRef.current) {
            tl.fromTo(headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
        }

        if (foldersRef.current) {
            tl.fromTo(foldersRef.current.children,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.5)' },
                '-=0.3'
            );
        }

        if (filesRef.current) {
            tl.fromTo(filesRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
                '-=0.2'
            );
        }
    }, [viewMode]);

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        // In a real app, this would upload files
        const droppedFiles = Array.from(e.dataTransfer.files);
        console.log('Dropped files:', droppedFiles);
    };

    const totalStorage = 500; // MB
    const usedStorage = 220; // MB
    const storagePercent = (usedStorage / totalStorage) * 100;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div ref={headerRef} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl">
                        <Folder className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Cloud Documents</h1>
                        <p className="text-muted-foreground">Manage and share project files</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <div className="flex border rounded-lg">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Storage Info */}
            <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30 border-cyan-200 dark:border-cyan-800">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <HardDrive className="h-5 w-5 text-cyan-600" />
                            <div>
                                <p className="font-medium">Storage Used</p>
                                <p className="text-sm text-muted-foreground">{usedStorage} MB of {totalStorage} MB</p>
                            </div>
                        </div>
                        <div className="w-64">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                                    style={{ width: `${storagePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Folders */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                <div ref={foldersRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mockFolders.map((folder) => (
                        <Card
                            key={folder.id}
                            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
                        >
                            <CardContent className="flex items-center gap-4 py-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50 transition-colors">
                                    <Folder className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-medium">{folder.name}</p>
                                    <p className="text-sm text-muted-foreground">{folder.files} files</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Upload Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
            >
                <Upload className={`h-10 w-10 mx-auto mb-4 ${isDragging ? 'text-cyan-500' : 'text-muted-foreground'}`} />
                <p className="text-lg font-medium">
                    {isDragging ? 'Drop files here' : 'Drag and drop files here'}
                </p>
                <p className="text-sm text-muted-foreground">or click Upload button above</p>
            </div>

            {/* Files */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Recent Files</h2>

                {viewMode === 'grid' ? (
                    <div ref={filesRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredFiles.map((file) => (
                            <Card
                                key={file.id}
                                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group"
                            >
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        {getFileIcon(file.type)}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                                                <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                                <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Share</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <p className="font-medium truncate">{file.name}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-muted-foreground">{file.size}</span>
                                        {file.shared && <Badge variant="secondary" className="text-xs">Shared</Badge>}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {file.uploadedAt}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card ref={filesRef}>
                        <CardContent className="p-0">
                            {filteredFiles.map((file, index) => (
                                <div
                                    key={file.id}
                                    className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${index !== filteredFiles.length - 1 ? 'border-b' : ''
                                        }`}
                                >
                                    {getFileIcon(file.type)}
                                    <div className="flex-1">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-sm text-muted-foreground">Uploaded by {file.uploadedBy}</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{file.size}</span>
                                    <span className="text-sm text-muted-foreground">{file.uploadedAt}</span>
                                    {file.shared && <Badge variant="secondary">Shared</Badge>}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> Preview</DropdownMenuItem>
                                            <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download</DropdownMenuItem>
                                            <DropdownMenuItem><Share2 className="mr-2 h-4 w-4" /> Share</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
