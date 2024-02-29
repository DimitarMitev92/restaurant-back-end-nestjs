import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Location1707923253100 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'location',
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
    await this.seedLocations(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('location', true, true, true);
  }

  private async seedLocations(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO location (name) VALUES
      ('Stara Zagora'),
      ('Varna'),
      ('Sofia'),
      ('Plovdiv'),
      ('Burgas'),
      ('Sliven'),
      ('Lovech'),
      ('Dobrich'),
      ('Ahtopol');
    `);
  }
}
