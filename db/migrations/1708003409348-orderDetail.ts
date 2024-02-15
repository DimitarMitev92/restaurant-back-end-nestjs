import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class OrderDetail1708003409348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_detail',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'meal_id', type: 'uuid', isNullable: false },
          { name: 'order_id', type: 'uuid', isNullable: false },
          { name: 'count', type: 'integer', isNullable: false },
          { name: 'total_price', type: 'double precision', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_detail',
      new TableForeignKey({
        columnNames: ['meal_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'meal',
      }),
    );

    await queryRunner.createForeignKey(
      'order_detail',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'order',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_deital', true, true, true);
  }
}
