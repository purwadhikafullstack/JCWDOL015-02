import prisma from '@/prisma';
import axios from 'axios';
import { Request, Response } from 'express';

export class PickupDeliveryRequestController {
  async createPickupDeliveryRequest(req: Request, res: Response): Promise<Response> {
    const { orderId, distance, driverId, fromAddressId, toAddressId, requestType, status } = req.body;

    try {
      const newRequest = await prisma.pickupDeliveryRequest.create({
        data: {
          orderId,
          distance,
          driverId,
          fromAddressId,
          toAddressId,
          requestType: requestType || "",
          status: status || "Wait to pick up",
        },
      });
      return res.status(201).json({
        status: 'ok',
        message: 'Pickup Delivery Request created successfully',
        data: newRequest,
      });
    } catch (error) {
      console.error('Error creating Pickup Delivery Request:', error);
      return res.status(500).json({ status: 'error', message: 'Error creating Pickup Delivery Request' });
    }
  }

  async getAllPickupDeliveryRequests(req: Request, res: Response): Promise<Response> {
    try {
      const requests = await prisma.pickupDeliveryRequest.findMany({
        include: {
          order: true,
          driver: true,
          fromAddress: true,
          toAddress: true,
          history: true,
        },
      });
      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching Pickup Delivery Requests:', error);
      return res.status(500).json({ status: 'error', message: 'Error fetching Pickup Delivery Requests' });
    }
  }

  async getPickupDeliveryRequestById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const request = await prisma.pickupDeliveryRequest.findUnique({
        where: { id: Number(id) },
        include: {
          order: true,
          driver: true,
          fromAddress: true,
          toAddress: true,
          history: true,
        },
      });

      if (!request) {
        return res.status(404).json({ status: 'error', message: 'Pickup Delivery Request not found' });
      }

      return res.status(200).json(request);
    } catch (error) {
      console.error('Error fetching Pickup Delivery Request:', error);
      return res.status(500).json({ status: 'error', message: 'Error fetching Pickup Delivery Request' });
    }
  
  }
  async getPickupDeliveryRequestWorkerId(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const request = await prisma.pickupDeliveryRequest.findMany({
        where: { driverId: Number(id) },
        include: {
          order: true,
          driver: true,
          fromAddress: true,
          toAddress: true,
          history: true,
        },
      });

      if (!request) {
        return res.status(404).json({ status: 'error', message: 'Pickup Delivery Request not found' });
      }

      return res.status(200).json(request);
    } catch (error) {
      console.error('Error fetching Pickup Delivery Request:', error);
      return res.status(500).json({ status: 'error', message: 'Error fetching Pickup Delivery Request' });
    }
  }

  async updatePickupDeliveryRequest(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { orderId, distance, driverId, fromAddressId, toAddressId, requestType, status } = req.body;

    try {
      const updatedRequest = await prisma.pickupDeliveryRequest.update({
        where: { id: Number(id) },
        data: {
          orderId,
          distance,
          driverId,
          fromAddressId,
          toAddressId,
          requestType,
          status,
        },
      });

      return res.status(200).json({
        status: 'ok',
        message: 'Pickup Delivery Request updated successfully',
        data: updatedRequest,
      });
    } catch (error:any) {
      console.error('Error updating Pickup Delivery Request:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ status: 'error', message: 'Pickup Delivery Request not found' });
      }

      return res.status(500).json({ status: 'error', message: 'Error updating Pickup Delivery Request' });
    }
  }

  async updatePickupDeliveryRequestStatus(req: Request, res: Response): Promise<Response> {
    const { id, status }: { id: number; status: string } = req.body;
  
    if (!id || !status) {
      return res.status(400).json({ status: 'error', message: 'ID and status are required' });
    }
  
    try {
      const request = await prisma.pickupDeliveryRequest.findUnique({
        where: { id },
      });
  
      if (!request) {
        return res.status(404).json({ status: 'error', message: 'Pickup Delivery Request not found' });
      }
  
      const updatedRequest = await prisma.pickupDeliveryRequest.update({
        where: { id },
        data: { status },
      });

      if (status === "done") {
        const order = await prisma.order.findUnique({where:{id:updatedRequest.orderId}})

        if (order) {

        if (order.status === "on_the_way_to_outlet") {
         const updateOrder =  await axios.patch(`${process.env.BACKEND_URL}/api/order/${order.id}`, {
            status: "arrived_at_outlet",
            userId: order.userId,
          });
        }
        else {
          const updateOrder =  await axios.patch(`${process.env.BACKEND_URL}/api/order/${order.id}`, {
            status: "delivered_to_customer",
            userId: order.userId,
          });
        }}
      }

      if (status === "onGoing") {
        const order = await prisma.order.findUnique({where:{id:updatedRequest.orderId}})

        if (order) {

        if (order.status === "waiting_for_pickup") {
         const updateOrder =  await axios.patch(`${process.env.BACKEND_URL}/api/order/${order.id}`, {
            status: "on_the_way_to_outlet",
            userId: order.userId,
          });
        }
        else {
          const updateOrder =  await axios.patch(`${process.env.BACKEND_URL}/api/order/${order.id}`, {
            status: "on_the_way_to_customer",
            userId: order.userId,
          });
        }}
      }
      
  
      return res.status(200).json({ status: 'success', updatedRequest });
    } catch (error) {
      console.error('Error updating Pickup Delivery Request status:', error);
      return res.status(500).json({ status: 'error', message: 'Error updating Pickup Delivery Request status' });
    }}

  async deletePickupDeliveryRequest(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      await prisma.pickupDeliveryRequest.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({
        status: 'ok',
        message: 'Pickup Delivery Request deleted successfully',
      });
    } catch (error:any) {
      console.error('Error deleting Pickup Delivery Request:', error);

      if (error.code === 'P2025') {
        return res.status(404).json({ status: 'error', message: 'Pickup Delivery Request not found' });
      }

      return res.status(500).json({ status: 'error', message: 'Error deleting Pickup Delivery Request' });
    }
  }
}


