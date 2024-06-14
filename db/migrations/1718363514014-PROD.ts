import { MigrationInterface, QueryRunner } from 'typeorm'

export class PROD1718363514014 implements MigrationInterface {
  name = 'PROD1718363514014'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstname\` varchar(50) NULL, \`lastname\` varchar(50) NULL, \`role\` varchar(15) NOT NULL DEFAULT 'CONTRIBUTOR', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`brand\` varchar(100) NOT NULL, \`model\` varchar(100) NOT NULL, \`vehicle_type\` varchar(100) NOT NULL, \`description\` text NULL, \`image\` varchar(255) NULL, \`price\` decimal NOT NULL, \`motor_type\` varchar(100) NULL, \`energy\` varchar(50) NOT NULL, \`consumption\` decimal NULL, \`transmission\` varchar(50) NOT NULL, \`power\` int NULL, \`fiscal_power\` int NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`user_id\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`user_id_2\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`product_user_id\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`product_user_id_2\` FOREIGN KEY (\`updated_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`product_user_id_2\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`product_user_id\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`user_id_2\``,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`user_id\``,
    )
    await queryRunner.query(`DROP TABLE \`products\``)
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    )
    await queryRunner.query(`DROP TABLE \`users\``)
  }
}
