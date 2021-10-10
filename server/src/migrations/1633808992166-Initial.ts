import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1633808992166 implements MigrationInterface {
  name = 'Initial1633808992166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "reservable" ("id" SERIAL NOT NULL, "legacy_id" character varying NOT NULL, "parent_name" character varying NOT NULL, "parent_id" character varying, "subparent_name" character varying, "subparent_id" character varying, "name" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "type" character varying NOT NULL, "sub_type" character varying NOT NULL, CONSTRAINT "PK_9eed68cd601723b51e3713cf3d0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_337177cc6f48f73b32886d9b3b" ON "reservable" ("parent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d90cbe4d822eaed1e7735e1076" ON "reservable" ("subparent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_46101493340d88ae86d942dce3" ON "reservable" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "campground" ("id" SERIAL NOT NULL, "legacy_id" character varying NOT NULL, "parent_name" character varying NOT NULL, "parent_id" character varying, "subparent_name" character varying, "subparent_id" character varying, "name" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "type" character varying NOT NULL, "sub_type" character varying NOT NULL, CONSTRAINT "PK_1a5f05bd721214e5e4798b71974" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12685807babc0a71d6b254825c" ON "campground" ("parent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf34a0f10e04ee2b0fa12aa4d1" ON "campground" ("subparent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_022bd4290634175533e11a2fef" ON "campground" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "trailhead" ("id" SERIAL NOT NULL, "legacy_id" character varying NOT NULL, "parent_name" character varying NOT NULL, "parent_id" character varying, "subparent_name" character varying, "subparent_id" character varying, "name" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "type" character varying NOT NULL, "sub_type" character varying NOT NULL, CONSTRAINT "PK_12cdb033bfe60a0ecdbfcd10e47" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbb8c1a16cb55454b7b7d60daa" ON "trailhead" ("parent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_754201b36834c876078853deec" ON "trailhead" ("subparent_name") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fa60f789f2db11f24076e3a190" ON "trailhead" ("name") `
    );
    await queryRunner.query(
      `CREATE TABLE "trip_request" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "active" boolean NOT NULL DEFAULT true, "custom_name" character varying, "type" character varying NOT NULL, "dates" date array NOT NULL, "locations" integer array NOT NULL, "min_nights" integer, "num_hikers" integer, "last_success" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_da800a751eedcb456b120e12292" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "phone" character varying, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_8e1f623798118e629b46a9e6299" UNIQUE ("phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "trip_request"`);
    await queryRunner.query(`DROP INDEX "IDX_fa60f789f2db11f24076e3a190"`);
    await queryRunner.query(`DROP INDEX "IDX_754201b36834c876078853deec"`);
    await queryRunner.query(`DROP INDEX "IDX_dbb8c1a16cb55454b7b7d60daa"`);
    await queryRunner.query(`DROP TABLE "trailhead"`);
    await queryRunner.query(`DROP INDEX "IDX_022bd4290634175533e11a2fef"`);
    await queryRunner.query(`DROP INDEX "IDX_cf34a0f10e04ee2b0fa12aa4d1"`);
    await queryRunner.query(`DROP INDEX "IDX_12685807babc0a71d6b254825c"`);
    await queryRunner.query(`DROP TABLE "campground"`);
    await queryRunner.query(`DROP INDEX "IDX_46101493340d88ae86d942dce3"`);
    await queryRunner.query(`DROP INDEX "IDX_d90cbe4d822eaed1e7735e1076"`);
    await queryRunner.query(`DROP INDEX "IDX_337177cc6f48f73b32886d9b3b"`);
    await queryRunner.query(`DROP TABLE "reservable"`);
  }
}
