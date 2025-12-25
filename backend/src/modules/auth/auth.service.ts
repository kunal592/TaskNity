import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
                team: dto.team,
                phone: dto.phone,
                address: dto.address,
                role: Role.MEMBER, // Default role
            },
        });

        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);

        return {
            message: 'User registered successfully',
            user: this.sanitizeUser(user),
            accessToken: token,
        };
    }

    async login(dto: LoginDto) {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check password
        const passwordValid = await bcrypt.compare(dto.password, user.password);

        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user.id, user.email, user.role);

        return {
            message: 'Login successful',
            user: this.sanitizeUser(user),
            accessToken: token,
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.sanitizeUser(user);
    }

    private generateToken(userId: string, email: string, role: Role): string {
        return this.jwtService.sign({
            sub: userId,
            email,
            role,
        });
    }

    private sanitizeUser(user: any) {
        const { password, ...result } = user;
        return result;
    }
}
