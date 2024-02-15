import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';
import { Type } from 'src/menu/entities/menu.entity';

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
            name: 'type',
            type: 'enum',
            enumName: 'menu_type_enum',
            enum: [
              Type.GLUTEN_FREE,
              Type.LUNCH_MENU,
              Type.VEGAN,
              Type.MAIN_MENU,
            ],
            default: `'MAIN_MENU'`,
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

    await queryRunner.createIndex(
      'menu',
      new TableIndex({
        name: 'IDX_MENU_TYPE',
        columnNames: ['type'],
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
    await queryRunner.dropIndex('menu', 'IDX_MENU_TYPE');
    await queryRunner.dropTable('menu');
  }
}
