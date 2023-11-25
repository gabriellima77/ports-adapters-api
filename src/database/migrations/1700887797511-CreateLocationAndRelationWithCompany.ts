import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationAndRelationWithCompany1700887797511
  implements MigrationInterface
{
  name = 'CreateLocationAndRelationWithCompany1700887797511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "location" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "cep" character varying NOT NULL,
        "street" character varying NOT NULL,
        "houseNumber" character varying NOT NULL,
        "neighborhood" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "companyId" integer,
        CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id")
      )
  `);
    await queryRunner.query(`
      ALTER TABLE "location"
      ADD CONSTRAINT "FK_f267b47598f6f0f69feaafaeaae" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "location" DROP CONSTRAINT "FK_f267b47598f6f0f69feaafaeaae"
    `);
    await queryRunner.query(`
      DROP TABLE "location"
    `);
  }
}
