import { AddressController } from '@/controllers/address.controllers';

import { Router } from 'express';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.addressController.getAllAddresses)
    this.router.get('/id/:id', this.addressController.getAddressById);
    this.router.get('/role/:role', this.addressController.getAllAddressByRole);
    this.router.post('/', this.addressController.createAddress);
    this.router.post('/reverse', this.addressController.createAddressReverse);
    this.router.put('/', this.addressController.updateAddress);
    this.router.delete('/', this.addressController.deleteAddress);
  }

  getRouter(): Router {
    return this.router;
  }
}
