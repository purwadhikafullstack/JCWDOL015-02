-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `Notification_userId_fkey`;

-- AlterTable
ALTER TABLE `notification` ADD COLUMN `workerId` INTEGER NULL,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_workerId_fkey` FOREIGN KEY (`workerId`) REFERENCES `OutletWorker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
