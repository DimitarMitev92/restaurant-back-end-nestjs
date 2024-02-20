import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Meal1708026131991 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'meal',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'picture',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'start_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
          },
          {
            name: 'start_hour',
            type: 'time without time zone',
          },
          {
            name: 'end_hour',
            type: 'time without time zone',
          },
          {
            name: 'price',
            type: 'double precision',
          },
          {
            name: 'weight',
            type: 'int',
          },
          {
            name: 'menu_id',
            type: 'uuid',
          },
          {
            name: 'category_id',
            type: 'uuid',
          },
          {
            name: 'package_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'meal',
      new TableIndex({
        name: 'IDX_MEAL_NAME',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createForeignKey(
      'meal',
      new TableForeignKey({
        columnNames: ['menu_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menu',
      }),
    );

    await queryRunner.createForeignKey(
      'meal',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
      }),
    );

    await queryRunner.createForeignKey(
      'meal',
      new TableForeignKey({
        columnNames: ['package_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'package',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('meal', 'menu_id');
    await queryRunner.dropForeignKey('meal', 'category_id');
    await queryRunner.dropForeignKey('meal', 'package_id');
    await queryRunner.dropIndex('meal', 'IDX_MEAL_NAME');
    await queryRunner.dropTable('meal');
  }
}
