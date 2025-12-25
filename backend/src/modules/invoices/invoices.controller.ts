import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
    constructor(private readonly invoicesService: InvoicesService) { }

    @Post()
    create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req: any) {
        return this.invoicesService.create(createInvoiceDto, req.user.userId);
    }

    @Get()
    findAll() {
        return this.invoicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoicesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateInvoiceDto: Partial<CreateInvoiceDto>) {
        return this.invoicesService.update(id, updateInvoiceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.invoicesService.remove(id);
    }
}
