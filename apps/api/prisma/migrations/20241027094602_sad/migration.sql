/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_outletId_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `isPrimary`,
    MODIFY `userId` INTEGER NULL,
    MODIFY `outletId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `mainAddress` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
