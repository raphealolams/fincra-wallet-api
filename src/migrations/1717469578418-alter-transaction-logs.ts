import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTransactionLogs1717469578418 implements MigrationInterface {
  name = 'AlterTransactionLogs1717469578418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_0895e953a27c954a480098be000"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_fd7f48660a266b62a66248848a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "REL_0895e953a27c954a480098be00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "REL_fd7f48660a266b62a66248848a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_0895e953a27c954a480098be000" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_fd7f48660a266b62a66248848a3" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_fd7f48660a266b62a66248848a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" DROP CONSTRAINT "FK_0895e953a27c954a480098be000"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "REL_fd7f48660a266b62a66248848a" UNIQUE ("sender_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "REL_0895e953a27c954a480098be00" UNIQUE ("recipient_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_fd7f48660a266b62a66248848a3" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_logs" ADD CONSTRAINT "FK_0895e953a27c954a480098be000" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
