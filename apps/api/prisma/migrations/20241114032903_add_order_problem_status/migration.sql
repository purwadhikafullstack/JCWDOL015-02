/*
  Warnings:

  - The values [iron,dryer] on the enum `WorkerJobHistory_station` will be removed. If these variants are still used in the database, this will fail.
  - The values [iron,dryer] on the enum `WorkerJobHistory_station` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `outletworker` MODIFY `role` ENUM('ironer', 'washer', 'packer', 'driver') NOT NULL;

-- AlterTable
ALTER TABLE `workerjobhistory` MODIFY `station` ENUM('ironer', 'washer', 'packer', 'driver') NOT NULL;
