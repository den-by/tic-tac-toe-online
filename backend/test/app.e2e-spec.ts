import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { faker } from "@faker-js/faker";

// TODO add full tests
describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/auth/register", () => {
    return request(app.getHttpServer())
      .post("/auth/register")
      .send({
        username: faker.internet.userName(),
        password: faker.internet.password(),
      })
      .expect(201);
  });

  it("/matches/current-user", () => {
    return request(app.getHttpServer())
      .get("/matches/current-user")
      .expect(403);
  });
});
