import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { faker } from "@faker-js/faker";

async function createUser(
  app: INestApplication,
  username: string = faker.internet.userName(),
  password: string = faker.internet.password(),
) {
  const data = await request(app.getHttpServer())
    .post("/auth/register")
    .send({ username, password });
  const {
    payload: { token },
  } = data.body;
  return { username, password, token };
}

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe("/auth/register", () => {
    it("should create a user", async () => {
      const username = faker.internet.userName();
      const password = faker.internet.password();
      return request(app.getHttpServer())
        .post("/auth/register")
        .send({ username, password })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("payload");
          expect(body.payload).toHaveProperty("token");
        });
    });
    it("should not create a user with the same username", async () => {
      const { username, password } = await createUser(app);
      await request(app.getHttpServer())
        .post("/auth/register")
        .send({ username, password })
        .expect(409);
    });
  });

  describe("/auth/login", () => {
    it("should return a token", async () => {
      const { username, password } = await createUser(app);
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ username, password })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty("loginToken");
          expect(body).toHaveProperty("userData");
          expect(body.userData).toHaveProperty("id");
          expect(body.userData).not.toHaveProperty("password");
          expect(body.userData).toMatchObject({
            username,
          });
        });
    });
    it("should not return a token with wrong password", async () => {
      const { username } = await createUser(app);
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({ username, password: faker.internet.password() })
        .expect(400);
    });
  });
  describe("/matches/current-user", () => {
    it("should return matches for current user", async () => {
      const { token } = await createUser(app);
      return request(app.getHttpServer())
        .get("/matches/current-user")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect(({ body }) => {
          expect(body).toBeInstanceOf(Array);
        });
    });
  });
});
