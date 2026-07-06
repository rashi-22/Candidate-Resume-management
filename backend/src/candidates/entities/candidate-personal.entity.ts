import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { CandidateEducation } from './candidate-education.entity';

@Entity('candidate_personal')
export class CandidatePersonal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  title: string;

  @Column()
  full_name: string;

  @Column({ type: 'date' })
  dob: string;

  @Column()
  country_id: number;

  @Column()
  state_county: string;

  @Column({ nullable: true })
  town_city: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  mobile_number: string;

  @Column({ nullable: true })
  total_experience: string;

  @Column({ type: 'text' })
  key_skills: string;

  // @Column()
  // functional_area: string;

  @Column({ default: false })
  is_active: boolean;

  @Column({ nullable: true })
  activation_token: string;

  @CreateDateColumn()
  created_at: Date;

  // Relational link to the education table
  @OneToOne(() => CandidateEducation, (education) => education.candidate, { cascade: true })
  education: CandidateEducation;
}