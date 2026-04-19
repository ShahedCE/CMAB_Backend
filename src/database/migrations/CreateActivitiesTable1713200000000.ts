import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivitiesTable1713200000000 implements MigrationInterface {
  name = 'CreateActivitiesTable1713200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`
      CREATE TABLE "activities" (
        "id" BIGSERIAL PRIMARY KEY,
        "title" VARCHAR(200) NOT NULL,
        "description" TEXT NOT NULL,
        "full_description" TEXT NOT NULL,
        "image_url" TEXT NOT NULL,
        "date" DATE NOT NULL,
        "created_by_admin_id" BIGINT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "fk_activities_created_by_admin"
          FOREIGN KEY ("created_by_admin_id")
          REFERENCES "admins"("id")
          ON DELETE SET NULL
      );
    `);

    await queryRunner.query(
      `CREATE INDEX "idx_activities_date" ON "activities" ("date");`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_activities_created_at" ON "activities" ("created_at");`,
    );

    await queryRunner.query(`
      CREATE TRIGGER trg_activities_updated_at
      BEFORE UPDATE ON "activities"
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_activities_updated_at ON "activities";`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_activities_created_at";`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_activities_date";`,
    );

    await queryRunner.query(`DROP TABLE IF EXISTS "activities";`);
  }
}