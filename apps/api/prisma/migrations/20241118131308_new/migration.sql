/*
  Warnings:

  - You are about to drop the column `laundryItemId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `isAssign` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `LoginToken` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `outletId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `workerRole` on the `user` table. All the data in the column will be lost.
  - The values [driver] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `laundryitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_laundryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_outletId_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `laundryItemId`;

-- AlterTable
ALTER TABLE `outlet` DROP COLUMN `address`,
    DROP COLUMN `avatar`,
    DROP COLUMN `isAssign`,
    DROP COLUMN `lat`,
    DROP COLUMN `lon`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `LoginToken`,
    DROP COLUMN `outletId`,
    DROP COLUMN `workerRole`,
    MODIFY `role` ENUM('customer', 'admin', 'superAdmin', 'worker') NOT NULL DEFAULT 'customer';

-- DropTable
DROP TABLE `laundryitem`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_outletId_fkey` FOREIGN KEY (`outletId`) REFERENCES `Outlet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
