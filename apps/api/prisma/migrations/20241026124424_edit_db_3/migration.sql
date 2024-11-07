/*
  Warnings:

  - You are about to drop the column `status` on the `workerjobhistory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `workerjobhistory` DROP COLUMN `status`;

-- AddForeignKey
ALTER TABLE `DriverStatus` ADD CONSTRAINT `DriverStatus_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `OutletWorker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
