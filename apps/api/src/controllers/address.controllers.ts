import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Address } from '@prisma/client';
import axios from 'axios';

export class AddressController {
  async getAllAddresses(req: Request, res: Response): Promise<Response> { ////<--------------------------------
    try {
      const addresses: Address[] = await prisma.address.findMany();

      if (!addresses.length) {
        return res.status(404).send({ error: 'No addresses found' });
      }

      return res.status(200).send(addresses);
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching addresses' });
    }
  }

  async getAllAddressByRole(req: Request, res: Response) { ////<--------------------------------
    const { role } = req.params;
    if (role === 'outlet') {
      try {
        const addresses: Address[] = await prisma.address.findMany({
          where: { outletId: { not: 0 } },
        });

        if (!addresses.length) {
          return res
            .status(404)
            .send({ error: 'No addresses found for outlets' });
        }

        return res.status(200).send(addresses);
      } catch (error) {
        return res
          .status(500)
          .send({ error: 'Error fetching outlet addresses' });
      }
    } else if (role === 'user') {
      try {
        const addresses = await prisma.address.findMany({
          where: { userId: { not: 0 } },
        });

        if (!addresses.length) {
          return res
            .status(404)
            .send({ error: 'No addresses found for users' });
        }

        return res.status(200).send(addresses);
      } catch (error) {
        return res.status(500).send({ error: 'Error fetching user addresses' });
      }
    } else {
      return res.status(400).send({ error: 'Invalid role' });
    }
  }

  async getAddressById(req: Request, res: Response) { ////<--------------------------------
    const { id } = req.params;

    try {
      const address = await prisma.address.findUnique({
        where: { id: Number(id) },
      });

      if (!address) {
        return res.status(404).send({ error: 'Address not found' });
      }

      return res.status(200).send(address);
    } catch (error) {
      return res.status(500).send({ error: 'Error fetching address' });
    }
  }

  async createAddress(req: Request, res: Response) {
    const {
      userId,
      outletId,
      address,
      city,
      state,
      postalCode,
      country,
    } = req.body;
  
    if (!userId && !outletId) {
      return res.status(400).send({ error: 'Either userId or outletId must be provided' });
    }
  
    try {
      const apiKey = '671dfa638d605573966053jft24917e';
  
      const geoResponse = await axios.get(`https://geocode.maps.co/search`, {
        params: {
          q: `${address}, ${city}, ${state}, ${postalCode}, ${country}`,
          api_key: apiKey,
        },
      });
  
      const data = geoResponse.data[0];
  
      if (!data) {
        return res.status(404).send({ error: 'Address not found' });
      }
  
      const { lat, lon, display_name } = data;
  
      const newAddress = await prisma.address.create({
        data: {
          userId: userId || null, 
          outletId: outletId || null,
          address: display_name,
          city: city || '',
          state: state || '',
          postalCode: postalCode || '',
          country: country || '',
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
      });
  
      return res.status(201).send(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
      return res.status(500).send({ error: 'Error creating address' });
    }
  }
  

  async createAddressReverse(req: Request, res: Response) {
    const { userId, outletId, latitude, longitude } = req.body;
  
    
    if (!userId && !outletId) {
      return res.status(400).send({ error: 'Either userId or outletId must be provided' });
    }
  
    try {
      const apiKey = '671dfa638d605573966053jft24917e';
  
      const reverseGeoResponse = await axios.get(
        `https://geocode.maps.co/reverse`,
        {
          params: { lat: latitude, lon: longitude, api_key: apiKey },
        },
      );
  
      const data = reverseGeoResponse.data;
  
      if (!data) {
        return res.status(404).send({ error: 'Location not found' });
      }
  
      const {
        display_name,
        address: { city_district, city, state, postcode, country },
        lat,
        lon,
      } = data;
  
      const newAddress = await prisma.address.create({
        data: {
          userId: userId || null,  
          outletId: outletId || null, 
          address: display_name,
          city: city || city_district,
          state: state || '',
          postalCode: postcode || '',
          country: country || '',
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
      });
  
      return res.status(201).send(newAddress);
    } catch (error) {
      console.error('Error creating address:', error);
      return res.status(500).send({ error: 'Error creating address' });
    }
  }

  async updateAddress(req: Request, res: Response) { ////<--------------------------------
    const { id } = req.params;
    const {
      userId,
      outletId,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = req.body;

    try {
      const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
          userId,
          outletId,
          address,
          city,
          state,
          postalCode,
          country,
          latitude,
          longitude,
        },
      });

      return res.status(200).send(updatedAddress);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Address not found' });
      }
      return res.status(500).send({ error: 'Error updating address' });
    }
  }

  async deleteAddress(req: Request, res: Response) {  ////<--------------------------------
    const { id } = req.params;
    try {
      await prisma.address.delete({
        where: { id: Number(id) },
      });
      return res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).send({ error: 'Address not found' });
      }
      return res.status(500).send({ error: 'Error deleting address' });
    }
  }
}