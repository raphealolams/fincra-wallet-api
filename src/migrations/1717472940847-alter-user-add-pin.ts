import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserAddPin1717472940847 implements MigrationInterface {
  name = 'AlterUserAddPin1717472940847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "pin" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "pin"`);
  }
}
