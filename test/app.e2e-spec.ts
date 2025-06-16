import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.listen(0);
  });
  afterAll(() => {
    app.close();
  });
  describe('Auth', () => {
    describe('SignUp', () => {
      it('Should SignUp', () => {
        const dto: AuthDto = {
          email: 'kamilref00123@gmail.com',
          password: 'kmr123123',
          phone: '45135454',
          phone2: '451335454',
          doctor: true,
          patient: false,
          domain: 'Surgery Operator',
          firstname: 'Kamel',
          lastname: 'Rifai',
          gender: 'M',
        };
        return pactum
          .spec()
          .post('http://localhost:3333/auth/SignUp')
          .withBody(dto)
          .expectStatus(201);
      });
    });
  });

  it.todo('Should Pass!');
});
