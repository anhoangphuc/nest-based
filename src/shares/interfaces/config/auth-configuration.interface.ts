export interface IAuthConfiguration {
  jwt: {
    secretKey: string;
    expireTime: number;
  };
}
