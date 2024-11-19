/*
  Warnings:

  - Added the required column `address` to the `Outlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Outlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Outlet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `outlet` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `isAssign` VARCHAR(191) NULL,
    ADD COLUMN `lat` VARCHAR(191) NOT NULL,
    ADD COLUMN `lon` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `_OutletToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OutletToUser_AB_unique`(`A`, `B`),
    INDEX `_OutletToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OutletToUser` ADD CONSTRAINT `_OutletToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Outlet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OutletToUser` ADD CONSTRAINT `_OutletToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
