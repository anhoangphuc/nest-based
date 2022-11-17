export interface IAuth {
  jwt: {
    secretKey: string;
    expireTime: number;
  };
}
