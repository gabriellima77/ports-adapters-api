import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserEmailToUnique1700960674527
  implements MigrationInterface
{
  name = 'ChangeUserEmailToUnique1700960674527';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"
    `);
  }
}
