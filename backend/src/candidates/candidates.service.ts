import { BadRequestException, Get, Injectable, NotFoundException, Query, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CandidatePersonal } from './entities/candidate-personal.entity';
import { Like, Repository } from 'typeorm';
import { CandidateEducation } from './entities/candidate-education.entity';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CandidatesService {
    constructor(
        @InjectRepository(CandidatePersonal) private personalRepo: Repository<CandidatePersonal>,
        @InjectRepository(CandidateEducation) private educationRepo: Repository<CandidateEducation>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
    ) { }

    async registerStep1(dto: any) {
        const existingUser = await this.personalRepo.findOne({
            where: [{ email: dto.email }, { username: dto.username }]
        })

        if (existingUser) {
            throw new BadRequestException('username or email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const activationToken = uuidv4();

        const candidate = this.personalRepo.create({
            ...dto,
            password: hashedPassword,
            activation_token: activationToken,
            is_active: false
        })

        return await this.personalRepo.save(candidate)
    }

    async registerStep2(candidateId: number, dto: any) {
        const candidate = await this.personalRepo.findOne({
            where: { id: candidateId }
        });

        if (!candidate) {
            throw new NotFoundException('Candidate profile not found for given reference');
        }

        let education = await this.educationRepo.findOne({
            where: { candidate: { id: candidateId } }
        })

        if (!education) {
            education = this.educationRepo.create();
            Object.assign(education, dto);
            education.candidate = candidate
        } else {
            Object.assign(education, dto)
        }
        await this.educationRepo.save(education);

        // Simulated verification mail log
        const activationLink = `http://localhost:3000/candidates/activate/${candidate.activation_token}`;


        try {
            await this.mailerService.sendMail({
                to: candidate.email,
                subject: 'Verify Your Candidate Registration Account',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 8px;">
                        <h2 style="color: #1e293b;">Welcome to the Platform!</h2>
                        <p>Thank you for submitting your profile application setup steps. Click the link option button below to verify your account registration instance:</p>
                        <div style="margin: 24px 0; text-align: center;">
                        <a href="${activationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">Activate My Account</a>
                        </div>
                        <p style="color: #64748b; font-size: 12px;">If the button doesn't work, copy and paste this link URL into your web browser:</p>
                        <p style="color: #2563eb; font-size: 12px; word-break: break-all;">${activationLink}</p>
                    </div>
                    `,
            });
        } catch (mailError) {
            // Log the exception pattern locally so the submission flow won't crash if SMTP hits a socket block
            console.error('SMTP Mail Transmission Failure Context:', mailError);
        }
        console.log(`\n[MAIL TRIGGER] Verification link for ${candidate.email}: ${activationLink}\n`);

        return { message: 'Step 2 educational data recorded successfully.', candidateId };
    }

    async activateAccount(token: string) {
        const candidate = await this.personalRepo.findOne({
            where: { activation_token: token }
        })

        if (!candidate) {
            throw new BadRequestException('Invalid or expired token')
        }

        candidate.is_active = true,
            candidate.activation_token = '';

        await this.personalRepo.save(candidate)

        return `<h1>Account activated successfully!</h1>`;
    }

    async candidateLogin(username: string, password: string) {
        // 1. Query by username ONLY to get the record context
        const candidate = await this.personalRepo.findOne({
            where: { username },
        });

        // 2. If no user exists with that username, fail early
        if (!candidate) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 3. Use bcrypt to compare the plain text input with the stored hash
        const isPasswordMatching = await bcrypt.compare(password, candidate.password);

        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 4. Enforce activation confirmation routines
        if (!candidate.is_active) {
            throw new UnauthorizedException(
                'This account is pending confirmation. Check your terminal logs for the activation link.',
            );
        }

        // 5. Build and sign identity token
        const payload = {
            id: candidate.id,
            username: candidate.username,
            role: 'candidate'
        };

        return {
            id: candidate.id,
            username: candidate.username,
            is_active: candidate.is_active,
            accessToken: this.jwtService.sign(payload),
        };
    }

    //Admin Methods

    async findAll(page: number = 1, limit: number = 10, search?: string, qualificationId?: number, designationId?: number) {
        // 1. Calculate numerical row skip offset metrics
        const skip = (page - 1) * limit;

        // 2. Build search condition query block dynamically if input exists
        let whereCondition: any = {};
        if (search && search.trim() !== '') {
            const searchString = `%${search.trim()}%`;

            // Matches against username OR full_name fields
            whereCondition = [
                { username: Like(searchString) },
                { full_name: Like(searchString) }
            ];
        }
        if (qualificationId) {
            whereCondition.education = {
                ...whereCondition.education,
                qualification_id: qualificationId
            };
        }
        if (designationId) {
            whereCondition.education = {
                ...whereCondition.education,
                current_designation_id: designationId
            };
        }

        // 3. Query records count alongside exact limited partition slice rows
        const [data, totalItems] = await this.personalRepo.findAndCount({
            where: whereCondition,
            relations: { education: true },
            order: { created_at: 'DESC' },
            skip: skip,
            take: limit,
        });

        // 4. Return structural envelope with paging metadata variables
        return {
            data,
            meta: {
                totalItems,
                itemCount: data.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            },
        };
    }

    async findOne(candidateId: number) {
        const candidate = await this.personalRepo.findOne({
            where: { id: candidateId },
            relations: {
                education: true
            }
        })
        if (!candidate) throw new NotFoundException(`Candidate #${candidateId} not found`);
        return candidate;
    }

    async update(id: number, dto: any) {
        await this.personalRepo.update(id, dto);
        return this.findOne(id);
    }
    async remove(candidateId: number) {
        await this.personalRepo.delete({ id: candidateId })
    }
}
