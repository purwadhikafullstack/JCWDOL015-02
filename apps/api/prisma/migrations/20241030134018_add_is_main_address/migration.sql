/*
  Warnings:

  - You are about to drop the column `mainAddress` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `isMain` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `mainAddress`;
