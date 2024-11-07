-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('waiting_for_pickup', 'on_the_way_to_outlet', 'arrived_at_outlet', 'weighed', 'washed', 'ironed', 'packed', 'waiting_for_payment', 'ready_for_delivery', 'on_the_way_to_customer', 'delivered_to_customer') NOT NULL DEFAULT 'waiting_for_pickup';
