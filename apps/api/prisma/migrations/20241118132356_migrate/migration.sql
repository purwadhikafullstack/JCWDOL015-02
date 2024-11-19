-- AlterTable
ALTER TABLE `order` ADD COLUMN `laundryItemId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('customer', 'admin', 'superAdmin', 'worker', 'driver') NOT NULL DEFAULT 'customer';

-- CreateTable
CREATE TABLE `LaundryItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_laundryItemId_fkey` FOREIGN KEY (`laundryItemId`) REFERENCES `LaundryItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
