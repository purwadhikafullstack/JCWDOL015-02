/*
  Warnings:

  - You are about to drop the `_outlettouser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_outlettouser` DROP FOREIGN KEY `_OutletToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_outlettouser` DROP FOREIGN KEY `_OutletToUser_B_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `LoginToken` VARCHAR(191) NULL,
    ADD COLUMN `outletId` INTEGER NULL,
    ADD COLUMN `workerRole` ENUM('ironer', 'washer', 'packer', 'driver') NULL;

-- DropTable
DROP TABLE `_outlettouser`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
