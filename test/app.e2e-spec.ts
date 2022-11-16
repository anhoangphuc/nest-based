import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

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
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'hoangphucnb97@gmail.com', password: '1' })
      .expect(201);

    expect(loginRes.body.accessToken).toBeDefined();

    await request(app.getHttpServer())
      .post('/auth/update-password')
      .set('Authorization', `Bearer ${loginRes.body.accessToken}`)
      .expect(201);
  });
});
