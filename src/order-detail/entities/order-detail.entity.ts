import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'meal_id' })
  mealId: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'count' })
  count: number;

  @Column({ name: 'total_price' })
  totalPrice: number;

  @Column({ name: 'additional_note' })
  additionalNote: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
