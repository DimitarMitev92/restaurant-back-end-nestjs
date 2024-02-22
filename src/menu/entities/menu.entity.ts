import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'menu_type_id' })
  menuTypeId: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
