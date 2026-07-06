import { Module } from '@nestjs/common';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';
import { CountryMaster, DesignationMaster, QualificationMaster } from './entities/master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      CountryMaster, 
      QualificationMaster, 
      DesignationMaster
    ])
  ],
  controllers: [MastersController],
  providers: [MastersService],
  exports: [TypeOrmModule],
})
export class MastersModule {}
