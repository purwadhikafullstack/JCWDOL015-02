/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the `userprofile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userverification` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[verifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userverification` DROP FOREIGN KEY `UserVerification_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NOT NULL DEFAULT 'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png',
    ADD COLUMN `loginToken` VARCHAR(255) NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    ADD COLUMN `verifyToken` VARCHAR(191) NULL,
    ADD COLUMN `verifyTokenExp` DATETIME(3) NULL,
    MODIFY `role` ENUM('customer', 'admin', 'superAdmin', 'worker') NOT NULL DEFAULT 'customer';

-- DropTable
DROP TABLE `userprofile`;

-- DropTable
DROP TABLE `userverification`;

-- CreateIndex
CREATE UNIQUE INDEX `User_verifyToken_key` ON `User`(`verifyToken`);
