import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDbSchema1717463516511 implements MigrationInterface {
  name = 'CreateDbSchema1717463516511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "available_balance" numeric(12,2) NOT NULL DEFAULT '0', "ledger_balance" numeric(12,2) NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "user_id" uuid, CONSTRAINT "REL_92558c08091598f7a4439586cd" UNIQUE ("user_id"), CONSTRAINT "PK_8402e5df5a30a229380e83e4f7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('SUB_USER', 'USER', 'ADMIN', 'SUPER_ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying, "last_name" character varying, "phone_number" character varying, "email" character varying NOT NULL, "password" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('DR', 'CR')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reference" character varying NOT NULL, "narration" character varying, "type" "public"."transactions_type_enum" NOT NULL DEFAULT 'CR', "amount" numeric(12,2) NOT NULL DEFAULT '0', "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'PROCESSING', "balance_before_transaction" numeric(12,2) NOT NULL DEFAULT '0', "balance_after_transaction" numeric(12,2) NOT NULL DEFAULT '0', "session_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "user_id" uuid, CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_txn_reference" ON "transactions" ("reference") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_txn_session_id" ON "transactions" ("session_id") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_logs_status_enum" AS ENUM('PROCESSING', 'SUCCESS', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "idempotency_key" character varying NOT NULL, "amount" numeric(12,2) NOT NULL DEFAULT '0', "narration" character varying NOT NULL, "status" "public"."transaction_logs_status_enum" NOT NULL DEFAULT 'PROCESSING', "session_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "version" integer NOT NULL, "recipient_id" uuid, "sender_id" uuid, CONSTRAINT "REL_0895e953a27c954a480098be00" UNIQUE ("recipient_id"), CONSTRAINT "REL_fd7f48660a266b62a66248848a" UNIQUE ("sender_id"), CONSTRAINT "PK_c7605f13413f4b5d06e53f2349b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "id_txn_log_idempotency_key" ON "transaction_logs" ("idempotency_key") `,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" ADD CONSTRAINT "FK_92558c08091598f7a4439586cda" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_e9acc6efa76de013e8c1553ed2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallets" DROP CONSTRAINT "FK_92558c08091598f7a4439586cda"`,
    );
    await queryRunner.query(`DROP INDEX "public"."id_txn_log_idempotency_key"`);
    await queryRunner.query(`DROP TABLE "transaction_logs"`);
    await queryRunner.query(
      `DROP TYPE "public"."transaction_logs_status_enum"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_txn_session_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_txn_reference"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "wallets"`);
  }
}
