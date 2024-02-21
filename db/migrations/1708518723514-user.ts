import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class User1708518329139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'addresses',
        type: 'text',
        isArray: true,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'addresses');
  }
}
