import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Menu1708002550105 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'menu_type_id',
            type: 'uuid',
          },
          {
            name: 'restaurant_id',
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

    await queryRunner.createForeignKey(
      'menu',
      new TableForeignKey({
        columnNames: ['menu_type_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menu_type',
      }),
    );

    await queryRunner.createForeignKey(
      'menu',
      new TableForeignKey({
        columnNames: ['restaurant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'restaurant',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('menu', 'restaurant_id');
    await queryRunner.dropForeignKey('menu', 'menu_type_id');
    await queryRunner.dropTable('menu');
  }
}
