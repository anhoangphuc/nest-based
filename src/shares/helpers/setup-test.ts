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
