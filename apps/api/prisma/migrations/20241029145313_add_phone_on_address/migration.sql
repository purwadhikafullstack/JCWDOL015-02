/*
  Warnings:

  - Added the required column `phone` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `avatar` VARCHAR(191) NOT NULL DEFAULT 'http://localhost:8000/api/public/avatar/avatar-1730191112129.png';
