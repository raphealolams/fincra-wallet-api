import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterUserMakePhoneUnique1717464989860
  implements MigrationInterface
{
  name = 'AlterUserMakePhoneUnique1717464989860';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17d1817f241f10a3dbafb169fd" ON "users" ("phone_number") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_17d1817f241f10a3dbafb169fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2"`,
    );
  }
}
