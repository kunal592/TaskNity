import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
    constructor(private prisma: PrismaService) { }

    async create(createInvoiceDto: CreateInvoiceDto, userId: string) {
        const { items, ...invoiceData } = createInvoiceDto;

        return this.prisma.invoice.create({
            data: {
                ...invoiceData,
                creatorId: userId,
                items: {
                    create: items,
                },
            },
            include: {
                items: true,
            },
        });
    }

    async findAll() {
        return this.prisma.invoice.findMany({
            include: {
                items: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                items: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!invoice) {
            throw new NotFoundException(`Invoice with ID ${id} not found`);
        }

        return invoice;
    }

    async update(id: string, updateData: Partial<CreateInvoiceDto>) {
        const { items, ...data } = updateData;

        // Handle item updates strategy: 
        // Simple strategy: delete all old items and re-create new ones if items are provided
        // This assumes full list is sent on update

        if (items) {
            await this.prisma.invoiceItem.deleteMany({
                where: { invoiceId: id },
            });

            return this.prisma.invoice.update({
                where: { id },
                data: {
                    ...data,
                    items: {
                        create: items,
                    },
                },
                include: { items: true },
            });
        }

        return this.prisma.invoice.update({
            where: { id },
            data,
            include: { items: true },
        });
    }

    async remove(id: string) {
        return this.prisma.invoice.delete({
            where: { id },
        });
    }
}
