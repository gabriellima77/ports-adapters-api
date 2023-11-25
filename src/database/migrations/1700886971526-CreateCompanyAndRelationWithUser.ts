import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompanyAndRelationWithUser1700886971526
  implements MigrationInterface
{
  name = 'CreateCompanyAndRelationWithUser1700886971526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "company" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "cnpj" character varying NOT NULL,
        "website" character varying,
        "userId" integer,
        CONSTRAINT "UQ_b55d9c6e6adfa3c6de735c5a2eb" UNIQUE ("cnpj"),
        CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "company"
      ADD CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "company" DROP CONSTRAINT "FK_c41a1d36702f2cd0403ce58d33a"
    `);
    await queryRunner.query(`
      DROP TABLE "company"
    `);
  }
}
