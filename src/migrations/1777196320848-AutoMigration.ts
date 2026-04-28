import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1777196320848 implements MigrationInterface {
    name = 'AutoMigration1777196320848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`images\` \`images\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contacts\` CHANGE \`images\` \`images\` text NULL DEFAULT 'NULL'`);
    }

}
