import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('country_master')
export class CountryMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  country_name: string;

  @Column({ default: true })
  status: boolean;
}

@Entity('qualification_master')
export class QualificationMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  qual_name: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: true })
  status: boolean;
}

@Entity('designation_master')
export class DesignationMaster {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  desig_name: string;

  @CreateDateColumn()
  created: Date;

  @Column({ default: true })
  status: boolean;
}