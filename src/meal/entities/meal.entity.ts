import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';
@Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'picture' })
  picture: string;

  @Column({ name: 'description' })
  description: string;

  @Column({ name: 'additional_note' })
  additionalNote: string;

  @CreateDateColumn({ name: 'start_date' })
  startDate: Date;

  @CreateDateColumn({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'start_hour', type: 'time' })
  startHour: string;

  @CreateDateColumn({ name: 'end_hour', type: 'time' })
  endHour: string;

  @Column('double precision')
  price: number;

  @Column({ name: 'weight' })
  weight: number;

  @Column({ name: 'menu_id' })
  menuId: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'package_id' })
  packageId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
