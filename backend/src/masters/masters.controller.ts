import { Controller, Get } from '@nestjs/common';
import { MastersService } from './masters.service';

@Controller('masters')
export class MastersController {
    constructor(private readonly mastersService: MastersService){}

    @Get('countries')
    getCountries(){
        return this.mastersService.getAllCountries();
    }

    @Get('qualifications')
    getQualifications(){
        return this.mastersService.getAllQualifiactions();
    }

    @Get('designations')
    getDesignations(){
        return this.mastersService.getAllDesignation();
    }

}
