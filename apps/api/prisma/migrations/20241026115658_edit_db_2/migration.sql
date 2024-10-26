/*
  Warnings:

  - The values [being_washed,being_ironed,being_packed] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `orderitem` table. All the data in the column will be lost.
  - Added the required column `fromAddressId` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAddressId` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` MODIFY `userId` INTEGER NOT NULL DEFAULT 0,
    MODIFY `outletId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('waiting_for_pickup', 'on_the_way_to_outlet', 'arrived_at_outlet', 'weighed', 'washed', 'ironed', 'packed', 'waiting_for_payment', 'ready_for_delivery', 'on_the_way_to_customer', 'delivered_to_customer') NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `pickupdeliveryrequest` ADD COLUMN `fromAddressId` INTEGER NOT NULL,
    ADD COLUMN `toAddressId` INTEGER NOT NULL,
    MODIFY `requestType` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Wait to pick up';

-- AlterTable
ALTER TABLE `workerjobhistory` ADD COLUMN `pickupDelivery` INTEGER NULL;

-- CreateTable
CREATE TABLE `DriverStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driverId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'available',
    `PdrId` INTEGER NULL,

    UNIQUE INDEX `DriverStatus_driverId_key`(`driverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PickupDeliveryRequest` ADD CONSTRAINT `PickupDeliveryRequest_fromAddressId_fkey` FOREIGN KEY (`fromAddressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PickupDeliveryRequest` ADD CONSTRAINT `PickupDeliveryRequest_toAddressId_fkey` FOREIGN KEY (`toAddressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerJobHistory` ADD CONSTRAINT `WorkerJobHistory_pickupDelivery_fkey` FOREIGN KEY (`pickupDelivery`) REFERENCES `PickupDeliveryRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
