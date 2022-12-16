import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { sleep } from '../src/shares/helpers/utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('Should get an JWT access token after login successfully', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'hoangphucnb97@gmail.com', password: '1' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hoangphucnb97@gmail.com', password: '1' })
      .expect(201);

    expect(loginRes.body.accessToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/update-password')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(201);
  });

  it(
    `Should unauthorized when token expired`,
    async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'hoangphucnb97@gmail.com', password: '1' });

      await sleep(2 * 1000);
      await request(app.getHttpServer())
        .post('/auth/update-password')
        .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
        .expect(401);
    },
    (2 + 1) * 1000,
  );
});
