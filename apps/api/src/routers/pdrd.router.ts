import { Router } from 'express';
import { verifyToken } from '@/middlewares/token'; 
import { PickupDeliveryRequestController } from '@/controllers/pdrd.controllers';

export class PickupDeliveryRequestRouter {
  private router: Router;
  private pickupDeliveryRequestController: PickupDeliveryRequestController

  constructor() {
    this.router = Router();
    this.pickupDeliveryRequestController = new PickupDeliveryRequestController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get all PickupDeliveryRequests
    this.router.get('/', this.pickupDeliveryRequestController.getAllPickupDeliveryRequests.bind(this.pickupDeliveryRequestController));

    // Get PickupDeliveryRequest by ID
    this.router.get('/:id', this.pickupDeliveryRequestController.getPickupDeliveryRequestById.bind(this.pickupDeliveryRequestController));

    this.router.get('/driver/:id', this.pickupDeliveryRequestController.getPickupDeliveryRequestWorkerId.bind(this.pickupDeliveryRequestController));

    // Create a new PickupDeliveryRequest
    this.router.post('/', this.pickupDeliveryRequestController.createPickupDeliveryRequest.bind(this.pickupDeliveryRequestController));

    // Update a PickupDeliveryRequest by ID
    this.router.put('/:id', this.pickupDeliveryRequestController.updatePickupDeliveryRequest.bind(this.pickupDeliveryRequestController));
    
    this.router.patch('/', this.pickupDeliveryRequestController.updatePickupDeliveryRequestStatus.bind(this.pickupDeliveryRequestController));
    

    // Delete a PickupDeliveryRequest by ID
    this.router.delete('/:id', this.pickupDeliveryRequestController.deletePickupDeliveryRequest.bind(this.pickupDeliveryRequestController));
  }

  getRouter(): Router {
    return this.router;
  }
}
