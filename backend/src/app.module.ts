// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { MastersModule } from './masters/masters.module';
// import { CandidatesModule } from './candidates/candidates.module';
// @Module({
//   imports: [MastersModule, CandidatesModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MastersModule } from './masters/masters.module';
import { CandidatesModule } from './candidates/candidates.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'sandbox.smtp.mailtrap.io',
        port: 587,
        secure: false,
        auth: {
          user: '051916b36e0bd8',
          pass: '0ebf9e906bcbfa'
        }
      },
      defaults: {
        from: '"Atologist-assignment" <no-reply@atologistassignment.com>'
      }
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Instead of relying on a single 'url' string, parse the parts manually:
      host: 'db.wnvtjippisxnlnhkrgiy.supabase.co', 
      port: 6543,
      username: 'postgres', // Replace with the string between "postgres." and "@" in your connection URI
      password: '7_%cU&auEe_MEnD',       // Put your database password cleanly here
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, 
      ssl: { rejectUnauthorized: false }, 
    }),
    MastersModule,
    CandidatesModule,
  ],
})
export class AppModule {}