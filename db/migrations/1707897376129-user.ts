import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class User1707897376129 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'first_name', type: 'varchar', isNullable: false },
          { name: 'last_name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'location_id', type: 'uuid', isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          {
            name: 'rights',
            type: 'enum',
            enum: ['ADMIN', 'CLIENT'],
            default: "'CLIENT'",
            isNullable: false,
          },
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
      true,
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_FIRST_NAME',
        columnNames: ['first_name'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_LAST_NAME',
        columnNames: ['last_name'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_EMAIL',
        columnNames: ['email'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'IDX_USER_PASSWORD',
        columnNames: ['password'],
      }),
    );

    await queryRunner.createForeignKey(
      'location',
      new TableForeignKey({
        columnNames: ['location_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'location',
      }),
    );

    await queryRunner.createIndex(
      'rights',
      new TableIndex({
        name: 'IDX_USER_RIGHTS',
        columnNames: ['rights'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user', true, true, true);
  }
}
