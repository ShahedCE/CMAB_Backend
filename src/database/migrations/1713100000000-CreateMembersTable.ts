import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMembersTable1713100000000 implements MigrationInterface {
  name = 'CreateMembersTable1713100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "members" (
        "id" BIGSERIAL PRIMARY KEY,
        "join_request_id" BIGINT NOT NULL UNIQUE,
        "full_name_bn" VARCHAR(160) NOT NULL,
        "full_name_en" VARCHAR(160) NOT NULL,
        "father_name" VARCHAR(160) NOT NULL,
        "mother_name" VARCHAR(160) NOT NULL,
        "date_of_birth" DATE NOT NULL,
        "national_id" VARCHAR(50) NOT NULL,
        "medical_reg_no" VARCHAR(50) NOT NULL,
        "membership_type" VARCHAR(50) NOT NULL,
        "email" VARCHAR(190) NOT NULL UNIQUE,
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
        "approved_at" TIMESTAMPTZ NOT NULL,
        "approved_by_admin_id" BIGINT NULL,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "fk_members_join_request"
          FOREIGN KEY ("join_request_id")
          REFERENCES "join_requests"("id")
          ON DELETE CASCADE,
        CONSTRAINT "fk_members_approved_by_admin"
          FOREIGN KEY ("approved_by_admin_id")
          REFERENCES "admins"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_members_email" ON "members" ("email");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_members_join_request_id" ON "members" ("join_request_id");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_members_created_at" ON "members" ("created_at");`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_members_is_active" ON "members" ("is_active");`,
    );

    await queryRunner.query(`
      CREATE TRIGGER trg_members_updated_at
      BEFORE UPDATE ON "members"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_members_updated_at ON "members";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_members_is_active";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_members_created_at";`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_members_join_request_id";`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_members_email";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "members";`);
  }
}
