// import { Module } from '@nestjs/common';
// import { CandidatesController } from './candidates.controller';
// import { CandidatesService } from './candidates.service';

// @Module({
//   controllers: [CandidatesController],
//   providers: [CandidatesService]
// })
// export class CandidatesModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { CandidatePersonal } from './entities/candidate-personal.entity';
import { CandidateEducation } from './entities/candidate-education.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([CandidatePersonal, CandidateEducation]),
  JwtModule.register({
    secret: 'super_secret_assignment_key_10h', // Use an env variable in production!
    signOptions: { expiresIn: '1d' },    // Token validity duration
  }),],
  controllers: [CandidatesController],
  providers: [CandidatesService],
})
export class CandidatesModule { }