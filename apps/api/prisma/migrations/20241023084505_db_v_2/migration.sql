/*
  Warnings:

  - Added the required column `outletId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distance` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `outletId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `pickupdeliveryrequest` ADD COLUMN `distance` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
