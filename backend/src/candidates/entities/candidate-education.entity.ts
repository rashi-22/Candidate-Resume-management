import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { CandidatePersonal } from './candidate-personal.entity';

@Entity('candidate_education')
export class CandidateEducation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  qualification_id: number;

  @Column({ nullable: true })
  specialization: string;

  @Column({ nullable: true })
  current_organization: string;

  @Column({ nullable: true })
  current_designation_id: number;

  @Column({ nullable: true })
  current_from_year: string;

  @Column({ nullable: true })
  current_to_year: string;

  @Column({ type: 'text', nullable: true })
  current_job_profile: string;

  @Column({ nullable: true })
  past_organization: string;

  @Column({ nullable: true })
  past_designation_id: number;

  @Column({ nullable: true })
  past_from_year: string;

  @Column({ nullable: true })
  past_to_year: string;

  @Column({ type: 'text', nullable: true })
  past_job_profile: string;

  @Column({ nullable: true })
  resume_path: string;

  // Setup the foreign key relationship linking back to personal table
  @OneToOne(() => CandidatePersonal, (candidate) => candidate.education, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'candidate_id' })
  candidate: CandidatePersonal;
}