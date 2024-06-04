import { MigrationInterface, QueryRunner } from 'typeorm';

export class SessionIdCanBeNull1717466134138 implements MigrationInterface {
  name = 'SessionIdCanBeNull1717466134138';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ALTER COLUMN "session_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ALTER COLUMN "session_id" SET NOT NULL`,
    );
  }
}
