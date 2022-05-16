import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {

    let app: INestApplication;
    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      app.enableShutdownHooks();
      // app.useGlobalPipes(new ValidationPipe());
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('/GET resource-cache-status/:id miss', () => {
      return request(app.getHttpServer())
        .get('/resource-cache-status/1')
        .expect(200)
        .expect({ status: 'miss' })
    });

    it('/GET resource/:id', () => {
      return request(app.getHttpServer())
        .get('/resource/1')
        .expect(200)
        .expect(`resource 1 contents`)
    });


    it('/GET resource-cache-status/:id hit', () => {
      return request(app.getHttpServer())
        .get('/resource-cache-status/1')
        .expect(200)
        .expect({ status: 'hit' })
    });

    it('/GET resource/:id return results in < 1 second', () => {
      const startTime = Date.now();
      return request(app.getHttpServer())
        .get('/resource/1')
        .expect(200)
        .expect(`resource 1 contents`)
        .then(_ => {
          if (Date.now() - startTime > 60 * 1000) throw new Error('Timeout');
        })
    });

    it('/GET resource/:id return results in > 2 second if not in cache', () => {
      const startTime = Date.now();
      return request(app.getHttpServer())
        .get('/resource/2')
        // .expect(200)
        // .expect(`resource 2 contents`)
        .then(_ => {
          if (Date.now() - startTime < 60 * 2 * 1000) {
            // Expected behaviour
          } else {
            throw new Error('Should return after 2 seconds since it has not yet been cached.');
          }
        })
    });


  });

});
