import { ClientSession, Connection } from 'mongoose';

export async function withTransaction<R = any>(
  connection: Connection,
  fn: (session: ClientSession) => Promise<R>,
): Promise<R> {
  const session = await connection.startSession();
  let result: R;
  try {
    await session.withTransaction(async (ses) => {
      result = await fn(ses);
    });
    return result;
  } finally {
    await session.endSession();
  }
}
