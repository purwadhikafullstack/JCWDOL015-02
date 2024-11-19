/*
  Warnings:

  - You are about to drop the column `address` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `lat` on the `outlet` table. All the data in the column will be lost.
  - You are about to drop the column `lon` on the `outlet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `outlet` DROP COLUMN `address`,
    DROP COLUMN `avatar`,
    DROP COLUMN `lat`,
    DROP COLUMN `lon`;
