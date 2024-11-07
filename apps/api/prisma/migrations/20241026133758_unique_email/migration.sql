/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Outlet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Outlet_email_key` ON `Outlet`(`email`);
