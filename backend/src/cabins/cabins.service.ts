import {
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from "@nestjs/common";
  import {
    getCabin,
    getCabins,
    getCabinPrice,
    getBookedDatesByCabinId,
  } from "../models/cabinModel.js";
  import { redisGetJson, redisSetJson } from "../lib/redisClient.js";
  
  @Injectable()
  export class CabinsService {
    async getCabinWithBookedDates(cabinId: number) {
      try {
        const [cabin, bookedDates] = await Promise.all([
          getCabin(cabinId),
          getBookedDatesByCabinId(cabinId),
        ]);
  
        if (!cabin) {
          throw new NotFoundException("Cabin not found");
        }
  
        return { cabin, bookedDates };
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException("Internal server error");
      }
    }
  
    async listCabins() {
      try {
        const cacheKey = "cabins:list";
        const ttl = Number(process.env.CABINS_CACHE_TTL_SECONDS || 300);
  
        const cached = await redisGetJson(cacheKey);
        if (cached) return cached;
  
        const cabins = await getCabins();
        await redisSetJson(cacheKey, cabins, ttl);
        return cabins;
      } catch (error) {
        throw new InternalServerErrorException("Cabins could not be loaded");
      }
    }
  
    async getPrice(cabinId: number) {
      try {
        const price = await getCabinPrice(cabinId);
        if (!price) {
          throw new NotFoundException("Cabin not found");
        }
        return price;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException("Internal server error");
      }
    }
  }
  