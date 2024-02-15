import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Type {
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  MAIN_MENU = 'MAIN_MENU',
  LUNCH_MENU = 'LUNCH_MENU',
}
@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Type })
  type: string;

  @Column({ name: 'restaurant_id' })
  restaurantId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
