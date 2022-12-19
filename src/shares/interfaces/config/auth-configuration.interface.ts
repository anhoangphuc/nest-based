export interface IAuthConfiguration {
  jwt: {
    secretKey: string;
    expireTime: number;
  };

  verifyToken: {
    secretKey: string;
    expireTime: number;
  };
}
