import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class OrderDetail1708518329139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('order_detail', [
      new TableColumn({
        name: 'additional_note',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order_detail',
      new TableColumn({
        name: 'additional_note',
        type: 'varchar',
      }),
    );
  }
}
