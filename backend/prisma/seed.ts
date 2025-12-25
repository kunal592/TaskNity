import { PrismaClient, Role, TaskStatus, Priority, AttendanceStatus, RequestStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Clean existing data
    await prisma.expense.deleteMany();
    await prisma.leave.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const owner = await prisma.user.create({
        data: {
            email: 'owner@tasknity.com',
            password: hashedPassword,
            name: 'System Owner',
            role: Role.OWNER,
            team: 'Executive',
            phone: '123-456-7890',
        },
    });

    const admin = await prisma.user.create({
        data: {
            email: 'admin@tasknity.com',
            password: hashedPassword,
            name: 'Alice Carter',
            role: Role.ADMIN,
            team: 'Core',
            phone: '123-456-7891',
        },
    });

    const member1 = await prisma.user.create({
        data: {
            email: 'brian@tasknity.com',
            password: hashedPassword,
            name: 'Brian Lee',
            role: Role.MEMBER,
            team: 'Frontend',
            phone: '123-456-7892',
        },
    });

    const member2 = await prisma.user.create({
        data: {
            email: 'david@tasknity.com',
            password: hashedPassword,
            name: 'David Kim',
            role: Role.MEMBER,
            team: 'Backend',
            phone: '123-456-7893',
        },
    });

    const viewer = await prisma.user.create({
        data: {
            email: 'viewer@tasknity.com',
            password: hashedPassword,
            name: 'Chloe Patel',
            role: Role.VIEWER,
            team: 'Design',
            phone: '123-456-7894',
        },
    });

    console.log('✅ Users created');

    // Create Projects
    const project1 = await prisma.project.create({
        data: {
            title: 'Website Redesign',
            progress: 70,
            isPublic: true,
            members: {
                connect: [{ id: admin.id }, { id: member1.id }, { id: member2.id }],
            },
        },
    });

    const project2 = await prisma.project.create({
        data: {
            title: "Mobile App 'Zenith'",
            progress: 45,
            isPublic: true,
            members: {
                connect: [{ id: member1.id }, { id: viewer.id }],
            },
        },
    });

    const project3 = await prisma.project.create({
        data: {
            title: 'API Development',
            progress: 90,
            isPublic: false,
            members: {
                connect: [{ id: admin.id }, { id: member2.id }],
            },
        },
    });

    console.log('✅ Projects created');

    // Create Tasks
    await prisma.task.createMany({
        data: [
            {
                title: 'Setup Landing Page',
                description: 'Create the main landing page with the new design.',
                status: TaskStatus.IN_PROGRESS,
                priority: Priority.HIGH,
                projectId: project1.id,
            },
            {
                title: 'Fix Login Bug',
                description: 'Users are reporting issues when logging in with special characters.',
                status: TaskStatus.TODO,
                priority: Priority.MEDIUM,
                projectId: project2.id,
            },
            {
                title: 'Design dashboard mockups',
                description: 'Create mockups for the new analytics dashboard.',
                status: TaskStatus.TODO,
                priority: Priority.HIGH,
                projectId: project1.id,
            },
            {
                title: 'Implement push notifications',
                description: 'Add push notification functionality to the mobile app.',
                status: TaskStatus.IN_PROGRESS,
                priority: Priority.MEDIUM,
                projectId: project2.id,
            },
            {
                title: 'Deploy staging environment',
                description: 'Set up and deploy the staging environment for testing.',
                status: TaskStatus.DONE,
                priority: Priority.LOW,
                projectId: project3.id,
            },
            {
                title: 'Write API documentation',
                description: 'Document all endpoints for the new API.',
                status: TaskStatus.DONE,
                priority: Priority.MEDIUM,
                projectId: project3.id,
            },
            {
                title: 'Classified Security Audit',
                description: 'Review security vulnerabilities in the authentication system.',
                status: TaskStatus.IN_PROGRESS,
                priority: Priority.HIGH,
                projectId: project3.id,
                classified: true,
            },
        ],
    });

    console.log('✅ Tasks created');

    // Create Attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.attendance.createMany({
        data: [
            { userId: admin.id, date: today, status: AttendanceStatus.PRESENT },
            { userId: member1.id, date: today, status: AttendanceStatus.REMOTE },
            { userId: member2.id, date: today, status: AttendanceStatus.PRESENT },
        ],
    });

    console.log('✅ Attendance created');

    // Create Leave Requests
    await prisma.leave.createMany({
        data: [
            {
                userId: member1.id,
                reason: 'Family emergency',
                date: new Date(today.getTime() + 86400000), // Tomorrow
                status: RequestStatus.PENDING,
            },
            {
                userId: viewer.id,
                reason: 'Doctor appointment',
                date: new Date(today.getTime() + 172800000), // Day after
                status: RequestStatus.APPROVED,
            },
        ],
    });

    console.log('✅ Leave requests created');

    // Create Expenses
    await prisma.expense.createMany({
        data: [
            {
                userId: admin.id,
                title: 'AWS Hosting',
                category: 'Infrastructure',
                amount: 120,
                date: today,
                status: RequestStatus.APPROVED,
            },
            {
                userId: member1.id,
                title: 'Team Lunch',
                category: 'HR',
                amount: 85,
                date: today,
                status: RequestStatus.PENDING,
            },
            {
                userId: admin.id,
                title: 'Figma Subscription',
                category: 'Design',
                amount: 45,
                date: today,
                status: RequestStatus.APPROVED,
            },
        ],
    });

    console.log('✅ Expenses created');

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Test Accounts:');
    console.log('  Owner: owner@tasknity.com / password123');
    console.log('  Admin: admin@tasknity.com / password123');
    console.log('  Member: brian@tasknity.com / password123');
    console.log('  Viewer: viewer@tasknity.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
