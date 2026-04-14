import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminAndWorkflowTables1712960000000
  implements MigrationInterface
{
  name = 'CreateAdminAndWorkflowTables1712960000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "admins" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" VARCHAR(120) NOT NULL,
        "email" VARCHAR(190) NOT NULL UNIQUE,
        "password_hash" TEXT NOT NULL,
        "role" VARCHAR(30) NOT NULL DEFAULT 'admin',
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "last_login_at" TIMESTAMPTZ NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "join_requests" (
        "id" BIGSERIAL PRIMARY KEY,
        "full_name_bn" VARCHAR(160) NOT NULL,
        "full_name_en" VARCHAR(160) NOT NULL,
        "father_name" VARCHAR(160) NOT NULL,
        "mother_name" VARCHAR(160) NOT NULL,
        "date_of_birth" DATE NOT NULL,
        "national_id" VARCHAR(50) NOT NULL,
        "medical_reg_no" VARCHAR(50) NOT NULL,
        "membership_type" VARCHAR(50) NOT NULL,
        "email" VARCHAR(190) NOT NULL,
        "mobile" VARCHAR(30) NOT NULL,
        "phone" VARCHAR(30) NULL,
        "present_village" VARCHAR(120) NOT NULL,
        "present_post" VARCHAR(120) NOT NULL,
        "present_thana" VARCHAR(120) NOT NULL,
        "present_district" VARCHAR(120) NOT NULL,
        "permanent_village" VARCHAR(120) NOT NULL,
        "permanent_post" VARCHAR(120) NOT NULL,
        "permanent_thana" VARCHAR(120) NOT NULL,
        "permanent_district" VARCHAR(120) NOT NULL,
        "specialty" VARCHAR(150) NULL,
        "education_entries" JSONB NOT NULL,
        "workplace_types" JSONB NOT NULL,
        "entry_fee" NUMERIC(12,2) NOT NULL DEFAULT 0,
        "annual_fee" NUMERIC(12,2) NOT NULL DEFAULT 0,
        "lifetime_fee" NUMERIC(12,2) NOT NULL DEFAULT 0,
        "declaration_accepted" BOOLEAN NOT NULL,
        "notes" TEXT NOT NULL,
        "profile_image_url" TEXT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
        "reviewed_by_admin_id" BIGINT NULL,
        "reviewed_at" TIMESTAMPTZ NULL,
        "rejection_reason" TEXT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "chk_join_requests_status"
          CHECK ("status" IN ('pending', 'approved', 'rejected')),
        CONSTRAINT "fk_join_requests_reviewed_by_admin"
          FOREIGN KEY ("reviewed_by_admin_id")
          REFERENCES "admins"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "contact_messages" (
        "id" BIGSERIAL PRIMARY KEY,
        "name" VARCHAR(120) NOT NULL,
        "email" VARCHAR(190) NOT NULL,
        "message" TEXT NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'unread',
        "replied_by_admin_id" BIGINT NULL,
        "replied_at" TIMESTAMPTZ NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "chk_contact_messages_status"
          CHECK ("status" IN ('unread', 'read', 'replied')),
        CONSTRAINT "fk_contact_messages_replied_by_admin"
          FOREIGN KEY ("replied_by_admin_id")
          REFERENCES "admins"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" BIGSERIAL PRIMARY KEY,
        "admin_id" BIGINT NULL,
        "type" VARCHAR(40) NOT NULL,
        "title" VARCHAR(180) NOT NULL,
        "body" TEXT NULL,
        "source_type" VARCHAR(40) NOT NULL,
        "source_id" BIGINT NULL,
        "meta" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "is_read" BOOLEAN NOT NULL DEFAULT false,
        "read_at" TIMESTAMPTZ NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "fk_notifications_admin"
          FOREIGN KEY ("admin_id")
          REFERENCES "admins"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "admin_otp_codes" (
        "id" BIGSERIAL PRIMARY KEY,
        "admin_id" BIGINT NOT NULL,
        "email" VARCHAR(190) NOT NULL,
        "otp_code_hash" TEXT NOT NULL,
        "purpose" VARCHAR(40) NOT NULL DEFAULT 'forgot_password',
        "expires_at" TIMESTAMPTZ NOT NULL,
        "used_at" TIMESTAMPTZ NULL,
        "attempt_count" INT NOT NULL DEFAULT 0,
        "max_attempt" INT NOT NULL DEFAULT 5,
        "requested_ip" INET NULL,
        "requested_user_agent" TEXT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "fk_admin_otp_codes_admin"
          FOREIGN KEY ("admin_id")
          REFERENCES "admins"("id")
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "admin_password_reset_logs" (
        "id" BIGSERIAL PRIMARY KEY,
        "admin_id" BIGINT NOT NULL,
        "email" VARCHAR(190) NOT NULL,
        "reset_method" VARCHAR(30) NOT NULL DEFAULT 'otp',
        "otp_code_id" BIGINT NULL,
        "status" VARCHAR(20) NOT NULL,
        "reason" TEXT NULL,
        "ip_address" INET NULL,
        "user_agent" TEXT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "chk_admin_password_reset_logs_status"
          CHECK ("status" IN ('success', 'failed')),
        CONSTRAINT "fk_admin_password_reset_logs_admin"
          FOREIGN KEY ("admin_id")
          REFERENCES "admins"("id")
          ON DELETE CASCADE,
        CONSTRAINT "fk_admin_password_reset_logs_otp_code"
          FOREIGN KEY ("otp_code_id")
          REFERENCES "admin_otp_codes"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_admins_email" ON "admins" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_admins_created_at" ON "admins" ("created_at");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_join_requests_email" ON "join_requests" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_join_requests_status" ON "join_requests" ("status");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_join_requests_created_at" ON "join_requests" ("created_at");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_contact_messages_email" ON "contact_messages" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contact_messages_status" ON "contact_messages" ("status");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_contact_messages_created_at" ON "contact_messages" ("created_at");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_notifications_created_at" ON "notifications" ("created_at");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_admin_otp_codes_email" ON "admin_otp_codes" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_admin_otp_codes_created_at" ON "admin_otp_codes" ("created_at");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_admin_password_reset_logs_email" ON "admin_password_reset_logs" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_admin_password_reset_logs_status" ON "admin_password_reset_logs" ("status");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_admin_password_reset_logs_created_at" ON "admin_password_reset_logs" ("created_at");`,
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_admins_updated_at
      BEFORE UPDATE ON "admins"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_join_requests_updated_at
      BEFORE UPDATE ON "join_requests"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_contact_messages_updated_at
      BEFORE UPDATE ON "contact_messages"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_contact_messages_updated_at ON "contact_messages";`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_join_requests_updated_at ON "join_requests";`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_admins_updated_at ON "admins";`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at_timestamp;`);

    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admin_password_reset_logs_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admin_password_reset_logs_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admin_password_reset_logs_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admin_otp_codes_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admin_otp_codes_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_notifications_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_messages_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_messages_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_messages_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_join_requests_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_join_requests_status";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_join_requests_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admins_created_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_admins_email";`);

    await queryRunner.query(`DROP TABLE IF EXISTS "admin_password_reset_logs";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admin_otp_codes";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contact_messages";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "join_requests";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "admins";`);
  }
}
