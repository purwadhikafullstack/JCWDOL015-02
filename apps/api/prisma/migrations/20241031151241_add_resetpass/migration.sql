-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetPass` VARCHAR(191) NULL,
    ADD COLUMN `resetPassExp` DATETIME(3) NULL;
