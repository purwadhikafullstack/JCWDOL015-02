-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_outletId_fkey`;

-- AlterTable
ALTER TABLE `outlet` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
