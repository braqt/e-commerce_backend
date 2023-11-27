import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

import envVars from "../constants/config";

export const checkRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ipAddress = req.ip;
  if (ipAddress) {
    const client = createClient({
      password: envVars.REDIS_DB_PASSWORD,
      socket: {
        host: envVars.REDIS_DB_HOST,
        port: +envVars.REDIS_DB_PORT,
      },
    });
    await client.connect();
    const limit = 120; // Maximum number of requests allowed
    const duration = 600; // Limit duration in seconds

    const currentCount = await client.incr(ipAddress);
    await client.expire(ipAddress, duration);
    await client.disconnect();
    if (currentCount > limit) {
      return res.sendStatus(429);
    }
    return next();
  } else {
    console.error("No IP address found in the request headers");
    return res.sendStatus(500);
  }
};
