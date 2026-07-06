import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryMaster, DesignationMaster, QualificationMaster } from './entities/master.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MastersService {
    constructor(
        @InjectRepository(CountryMaster) private countryRepo: Repository<CountryMaster>,
        @InjectRepository(QualificationMaster) private qualificationRepo: Repository<QualificationMaster>,
        @InjectRepository(DesignationMaster) private designationRepo: Repository<DesignationMaster>
    ) { }


    async getAllCountries() {
        return await this.countryRepo.find({ where: {status: true}})
    }

    async getAllQualifiactions(){
        return await this.qualificationRepo.find({where: {status: true}})
    }

    async getAllDesignation() {
        return await this.designationRepo.find({where:{status: true}})
    }
}
