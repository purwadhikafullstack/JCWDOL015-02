/*
  Warnings:

  - You are about to drop the column `paymentLink` on the `order` table. All the data in the column will be lost.
  - You are about to alter the column `paymentStatus` on the `order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentLink`,
    MODIFY `paymentStatus` ENUM('pending', 'unpaid', 'paid') NOT NULL DEFAULT 'pending';
