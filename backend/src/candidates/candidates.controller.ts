import { Body, Controller, Post, Param, UploadedFile, UseInterceptors, Get, Put, Delete, Query } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer'

@Controller('candidates')
export class CandidatesController {
    constructor(private readonly candidatesService: CandidatesService) { }

    @Post('register-step1')
    step1(@Body() dto: any) {
        return this.candidatesService.registerStep1(dto)
    }

    @Post('register-step2/:id')
    @UseInterceptors(FileInterceptor('resume', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `file-${uniqueSuffix}${extname(file.originalname)}`)
            }
        })
    }))
    step2(@Param('id') id: string, @Body() dto: any, @UploadedFile() file: Express.Multer.File) {
        if (file) dto.resume_path = file.path;

        return this.candidatesService.registerStep2(+id, dto)
    }

    @Get('activate/:token')
    activate(@Param('token') token: string) {
        return this.candidatesService.activateAccount(token);
    }

    @Post('login')
    login(@Body('username') username: string, @Body('password') password: string) {
        console.log("username: ", username, password)
        return this.candidatesService.candidateLogin(username, password)
    }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('qualification_id') qualificationId?: string,
        @Query('designation_id') designationId?: string,
    ) {
        // Convert query parameters from strings to base-10 numerical values
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        const qualifyId = qualificationId ? parseInt(qualificationId) : 0
        const designId = designationId ? parseInt(designationId) : 0

        return await this.candidatesService.findAll(pageNum, limitNum, search, qualifyId, designId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.candidatesService.findOne(+id)
    }

    @Put()
    update(@Param('id') id: number, @Body() dto: any) {
        return this.candidatesService.update(+id, dto)
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.candidatesService.remove(+id)
    }
}
