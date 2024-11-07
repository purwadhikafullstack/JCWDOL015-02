/*
  Warnings:

  - A unique constraint covering the columns `[resetPass]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_resetPass_key` ON `User`(`resetPass`);
