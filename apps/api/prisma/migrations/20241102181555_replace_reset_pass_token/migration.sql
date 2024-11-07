/*
  Warnings:

  - You are about to drop the column `resetPass` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `resetPassExp` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_resetPass_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `resetPass`,
    DROP COLUMN `resetPassExp`,
    ADD COLUMN `userToken` VARCHAR(191) NULL,
    ADD COLUMN `userTokenExp` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_userToken_key` ON `User`(`userToken`);
