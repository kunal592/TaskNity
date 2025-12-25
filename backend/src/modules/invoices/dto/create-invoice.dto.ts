import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, ValidateNested, IsUUID, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '@prisma/client';

export class InvoiceItemDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    amount: number;
}

export class CreateInvoiceDto {
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @IsString()
    @IsNotEmpty()
    clientName: string;

    @IsString()
    @IsNotEmpty()
    clientEmail: string;

    @IsString()
    @IsOptional()
    clientAddress?: string;

    @IsDateString()
    issueDate: string;

    @IsDateString()
    dueDate: string;

    @IsEnum(InvoiceStatus)
    @IsOptional()
    status?: InvoiceStatus;

    @IsNumber()
    subTotal: number;

    @IsNumber()
    @IsOptional()
    taxRate?: number;

    @IsNumber()
    @IsOptional()
    taxAmount?: number;

    @IsNumber()
    @IsOptional()
    discount?: number;

    @IsNumber()
    totalAmount: number;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InvoiceItemDto)
    items: InvoiceItemDto[];
}
