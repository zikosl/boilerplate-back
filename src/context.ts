import { PrismaClient } from '@prisma/client';
// import { RedisPubSub } from 'graphql-redis-subscriptions';
// import Redis from 'ioredis';

const prisma = new PrismaClient()

// const options: any = {
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: process.env.REDIS_PORT ? process.env.REDIS_PORT : '6379',
//   password: process.env.REDIS_PASSWORD,
//   retryStrategy: (times: any) => {
//     // reconnect after
//     return Math.min(times * 50, 2000);
//   }
// };
// const pubsub = new RedisPubSub({
//   publisher: new Redis(options),
//   subscriber: new Redis(options)
// });



export interface Context {
  prisma: PrismaClient
  req: any // HTTP request carrying the `Authorization` header
}

export function createContext(req: any) {
  return {
    ...req,
    prisma,
    // pubsub: pubsub,
  }
}
