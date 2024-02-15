import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRights {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  @IsNotEmpty()
  firstName: string;

  @Column({ name: 'last_name' })
  @IsNotEmpty()
  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ name: 'location_id' })
  @IsNotEmpty()
  locationId: string;

  @Column({ type: 'enum', enum: UserRights })
  @IsNotEmpty()
  @IsEnum(UserRights)
  rights: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
