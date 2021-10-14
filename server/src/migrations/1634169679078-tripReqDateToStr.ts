import {MigrationInterface, QueryRunner} from "typeorm";

export class tripReqDateToStr1634169679078 implements MigrationInterface {
    name = 'tripReqDateToStr1634169679078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."trip_request" DROP COLUMN "dates"`);
        await queryRunner.query(`ALTER TABLE "public"."trip_request" ADD "dates" character varying array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."trip_request" DROP COLUMN "dates"`);
        await queryRunner.query(`ALTER TABLE "public"."trip_request" ADD "dates" date array NOT NULL`);
    }

}
