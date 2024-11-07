import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Address } from '@prisma/client';
import axios from 'axios';
const geocodeApiUrl = `https://api.opencagedata.com/geocode/v1/json`;

export class AddressController {
  async getAllAddresses(req: Request, res: Response): Promise<Response> { 
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

  async getAllAddressByRole(req: Request, res: Response) { 
    const { role } = req.params;
    if (role === 'outlet') {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 2;
        const startIndex = (page - 1) * limit;
        const addresses = await prisma.address.findMany({
          where: { outletId: { not: 0 } },
        });
        if (!addresses.length) {
          return res.status(404).send({ error: 'No addresses found for outlets' });
        }
        const paginatedAddress = addresses.slice(startIndex, startIndex + limit);
        return res.status(200).send(
          {status:"ok", message: "Get all outlet addresses successfully", data: paginatedAddress, currentPage: page, totalPages: Math.ceil(addresses.length / limit)}
      );
      } catch (error) {
        return res.status(500).send({ error: 'Error fetching outlet addresses' });
      }
    } else if (role === 'user') {
      try {
        const addresses = await prisma.address.findMany({
          where: { userId: { not: 0 } },
        })

        if (!addresses.length) {
          return res.status(404).send({ error: 'No addresses found for users' });
        }
        return res.status(200).send(addresses);
      } catch (error) {
        return res.status(500).send({ error: 'Error fetching user addresses' });
      }
    } else {
      return res.status(400).send({ error: 'Invalid role' });
    }
  }

  async getOutlesAddressByState(req: Request, res: Response) {
    const { state } = req.params;
    try {
      if (!state) throw "City is required";
      const addresses = await prisma.address.findMany({
        where:{state, outletId: {not: 0}},
      })
      if(!addresses) throw "Address not found";
      return res.status(200).send({status:"ok", message: "Get Address By State Successfully", data: addresses});
    } catch (error) {
      if (error instanceof Error) {res.status(400).send({status: "error",message: error.message,});}
      res.status(400).send({ status: "error",message: error,});
    }
  }

  async getAddressById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const address = await prisma.address.findUnique({
        where: { id: Number(id) },
      });
      if (!address) {
        return res.status(404).send({ error: 'Address not found' });
      }
      return res.status(200).send({ status: 'ok', message: 'Get Address By Id Successfully', data: address });
    } catch (error) {
      return res.status(500).send({ status: 'error', message: 'Error fetching address' });
    }
  }
  async createAddress(req: Request, res: Response) {
    const { phone, address, city, state, country, postalCode, outletId, userId } = req.body;
    
    try {
      if (!userId && !outletId) {
        return res.status(400).send({ status: "error" ,message: 'Either userId or outletId must be provided' });
      }
      const geocodeResponse = await axios.get(geocodeApiUrl, {
        params: {
          q: `${address}, ${city}, ${state}, ${country}, ${postalCode}`,
          key: process.env.OPENCAGE_API_KEY,
          language: 'en',
        }
      });
      if (geocodeResponse.data.length == 0) {
        return res.status(400).json({ error: 'Address not found.' , geocodeResponse: geocodeResponse.data});
      }
      const { lat, lng } = geocodeResponse.data.results[0].geometry;
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const checkAddress = await prisma.address.findMany({ where: { userId } });
      let isMain = checkAddress.length === 0; 

      const newAddress = await prisma.address.create({
        data: {
          userId : userId || null,
          outletId: outletId || null,
          address: address,
          city: city,
          state: state,
          isMain: isMain,
          postalCode: postalCode,
          country: country,
          phone: phone,
          latitude: latitude,   // Menyimpan latitude
          longitude: longitude,  // Menyimpan longitude
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return res.status(201).json({
        status: 'ok',
        message: 'Create Address Successfully',
        data: newAddress,
      });
    } catch (error) {
      return res.status(500).json({ 
        status: 'error', 
        message: error 
      });
    }
  }

  async getAddresByUserId(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if(!id) throw new Error('User id not found');
      const addresses = await prisma.address.findMany({
        where: { userId: Number(id) },
      })
      if(!addresses){
        return res.status(404).send({ status: 'error', message: 'The user has not created an address' });
      }
      return res.status(200).send({
        status: 'ok',
        message: 'Get All Address By User Id Successfully',
        data: addresses
      });
    } catch (error) {
      if (error instanceof Error) {res.status(400).send({status: "error",message: error.message,});}
      res.status(400).send({ status: "error",message: error,});
    }
  }
  async createAddressReverse(req: Request, res: Response) {
    const { userId, outletId, latitude, longitude } = req.body;
    try {
      if (!userId && !outletId) {
        return res.status(400).send({ error: 'Either userId or outletId must be provided' });
      }
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
  
  async updateAddress(req: Request, res: Response) {
    const { id, address, city, state, postalCode, country, phone } = req.body;
    try {
      const geocodeResponse = await axios.get(geocodeApiUrl, {
        params: {q: `${address}, ${city}, ${state}, ${country}, ${postalCode}`,key: process.env.OPENCAGE_API_KEY,language: 'en'}
      });
      if (geocodeResponse.data.length == 0) throw new Error('Address not found.')
      const { lat, lng } = geocodeResponse.data.results[0].geometry;
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
          address,
          city,
          state,
          postalCode,
          country,
          phone,
          latitude,
          longitude
        },
      });

      return res.status(200).send(updatedAddress);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send({status: "error", message: error.message});
      }
      return res.status(400).send({status: "error",message: error});
    }
  }

  async setMainAddress(req: Request, res: Response) {
    const { userId, addressId } = req.body;
    try {
      if(!userId) throw new Error('User id not found');
      if(!addressId) throw new Error('Address id not found');
      await prisma.address.updateMany({
        where: { userId: Number(userId) , isMain: true},
        data: { isMain: false },
      }) 
      await prisma.address.update({
        where: { id: Number(addressId) },
        data: { isMain: true },
      })
      return res.status(201).json({
        status: 'ok',
        message: 'Set Main Address Successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send({status: "error", message: error.message});
      }
      return res.status(400).send({status: "error",message: error});
    }
  }


  async deleteAddress(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if(!id) throw new Error('Address id not found');
      const deletedAddress = await prisma.address.delete({
        where: { id: Number(id) },
      });
      if(!deletedAddress) throw new Error('Address not found');
      return res.status(200).send({status: 'ok', message: 'Delete Address Successfully',data: deletedAddress});
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send({status: "error", message: error.message});
      }
      return res.status(400).send({status: "error",message: error});
    }
  }
}