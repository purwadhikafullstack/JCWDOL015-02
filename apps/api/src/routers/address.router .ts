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
    this.router.get('/outlets/:role', this.addressController.getAllAddressByRole);
    this.router.get('/outlet/by/:state', this.addressController.getOutlesAddressByState);
    this.router.get('/user/:id', this.addressController.getAddresByUserId);
    this.router.patch('/set-main', this.addressController.setMainAddress);
    this.router.post('/create', this.addressController.createAddress);
    this.router.post('/reverse', this.addressController.createAddressReverse);
    this.router.put('/update', this.addressController.updateAddress);
    this.router.delete('/delete/:id', this.addressController.deleteAddress);
  }

  getRouter(): Router {
    return this.router;
  }
}
