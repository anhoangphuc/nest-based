import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

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

export function randomString(length: number, withNumber: boolean) {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  Array.from(Array(length).keys())
    .map((_) => s.charAt(Math.floor(Math.random() * (withNumber ? s.length : s.length - 10))))
    .join('');
}

export function randomEmail(): string {
  return `${randomString(10, false)}@email.com`;
}

export function randomPassword(): string {
  return `${randomString(10, true)}`;
}
