import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import RedisMemoryServer from 'redis-memory-server';

let mongod: MongoMemoryReplSet;
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryReplSet.create({
        replSet: { count: 1 },
      });
      const mongoUri = mongod.getUri();
      return { uri: mongoUri, ...options };
    },
  });

export const closeMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
  }
};

export async function startRedisServer() {
  try {
    const redisServer = new RedisMemoryServer({ instance: { ip: '127.0.0.1', port: 6379 } });
    await redisServer.start();
  } catch (e) {
    // If port 6379 is already start, means redis started
    if (e.toString().includes('Port 6379 already in use')) return;
    throw e;
  }
}

export function randomString(length: number, withNumber: boolean): string {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(Array(length).keys())
    .map((_) => s.charAt(Math.floor(Math.random() * (withNumber ? s.length : s.length - 10))))
    .join('');
}

export function randomEmail(): string {
  return `${randomString(10, false)}@email.com`;
}

export function randomPassword(): string {
  return `${randomString(10, true)}`;
}
