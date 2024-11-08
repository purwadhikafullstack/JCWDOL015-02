/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `address` table. All the data in the column will be lost.
  - The values [being_washed,being_ironed,being_packed] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `orderitem` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `itemChecked` on the `workerjobhistory` table. All the data in the column will be lost.
  - You are about to drop the column `requestBypass` on the `workerjobhistory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `workerjobhistory` table. All the data in the column will be lost.
  - You are about to alter the column `station` on the `workerjobhistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - A unique constraint covering the columns `[workerId,date]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Outlet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workerId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laundry_type` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `iron` on table `orderitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `washer` on table `orderitem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dryer` on table `orderitem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `distance` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromAddressId` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAddressId` to the `PickupDeliveryRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `address` DROP COLUMN `isPrimary`,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `workerId` INTEGER NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `workerId` INTEGER NOT NULL,
    MODIFY `package` VARCHAR(191) NULL,
    MODIFY `status` ENUM('waiting_for_pickup', 'on_the_way_to_outlet', 'arrived_at_outlet', 'weighed', 'washed', 'ironed', 'packed', 'waiting_for_payment', 'ready_for_delivery', 'on_the_way_to_customer', 'delivered_to_customer') NOT NULL,
    MODIFY `totalWeight` DOUBLE NULL,
    MODIFY `totalPrice` DOUBLE NULL;

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `status`,
    ADD COLUMN `laundry_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` DOUBLE NOT NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL,
    MODIFY `iron` INTEGER NOT NULL,
    MODIFY `washer` INTEGER NOT NULL,
    MODIFY `dryer` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `outlet` DROP COLUMN `address`;

-- AlterTable
ALTER TABLE `pickupdeliveryrequest` ADD COLUMN `distance` INTEGER NOT NULL,
    ADD COLUMN `fromAddressId` INTEGER NOT NULL,
    ADD COLUMN `toAddressId` INTEGER NOT NULL,
    MODIFY `requestType` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'Wait to pick up';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `mainAddress` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userprofile` MODIFY `firstName` VARCHAR(191) NULL,
    MODIFY `lastName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `workerjobhistory` DROP COLUMN `itemChecked`,
    DROP COLUMN `requestBypass`,
    DROP COLUMN `status`,
    ADD COLUMN `pickupDelivery` INTEGER NULL,
    MODIFY `station` ENUM('iron', 'washer', 'dryer', 'driver') NOT NULL;

-- CreateTable
CREATE TABLE `samples` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `samples_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriverStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `driverId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'available',
    `PdrId` INTEGER NULL,

    UNIQUE INDEX `DriverStatus_driverId_key`(`driverId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Attendance_workerId_date_key` ON `Attendance`(`workerId`, `date`);

-- CreateIndex
CREATE UNIQUE INDEX `Outlet_email_key` ON `Outlet`(`email`);

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `OutletWorker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PickupDeliveryRequest` ADD CONSTRAINT `PickupDeliveryRequest_fromAddressId_fkey` FOREIGN KEY (`fromAddressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PickupDeliveryRequest` ADD CONSTRAINT `PickupDeliveryRequest_toAddressId_fkey` FOREIGN KEY (`toAddressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkerJobHistory` ADD CONSTRAINT `WorkerJobHistory_pickupDelivery_fkey` FOREIGN KEY (`pickupDelivery`) REFERENCES `PickupDeliveryRequest`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverStatus` ADD CONSTRAINT `DriverStatus_driverId_fkey` FOREIGN KEY (`driverId`) REFERENCES `OutletWorker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
