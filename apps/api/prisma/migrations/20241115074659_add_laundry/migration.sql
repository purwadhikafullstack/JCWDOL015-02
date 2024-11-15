/*
  Warnings:

  - The values [driver] on the enum `WorkerJobHistory_station` will be removed. If these variants are still used in the database, this will fail.
  - The values [driver] on the enum `WorkerJobHistory_station` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `outletworker` MODIFY `role` ENUM('iron', 'washer', 'dryer') NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('customer', 'admin', 'superAdmin', 'worker', 'driver') NOT NULL DEFAULT 'customer';

-- AlterTable
ALTER TABLE `workerjobhistory` MODIFY `station` ENUM('iron', 'washer', 'dryer') NOT NULL;
