import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import {
  CountryListProviderToken,
  LandborderListProviderToken
} from '../src/dataset/constants';
import mockCountries from '../src/dataset/__fixtures__/countries';
import mockLandborders from '../src/dataset/__fixtures__/landborders';
import { CountryDto } from '../src/dto/country-dto';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CountryListProviderToken)
      .useValue(mockCountries)
      .overrideProvider(LandborderListProviderToken)
      .useValue(mockLandborders)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/api/countries', () => {
    test('[GET]', () => {
      return request(app.getHttpServer())
        .get('/api/countries')
        .expect(200)
        .expect(mockCountries);
    });
  });

  describe('[GET] /api/countries/:country should respond correctly', () => {
    let randomCountry: CountryDto;

    beforeEach(() => {
      randomCountry =
        mockCountries[Math.floor(Math.random() * mockCountries.length)];
    });

    test('when sending :country param as name of country', () => {
      return request(app.getHttpServer())
        .get(`/api/countries/${randomCountry.name}`)
        .expect(200)
        .expect([randomCountry]);
    });

    test('when sending :country param as iso2 code of country', () => {
      return request(app.getHttpServer())
        .get(`/api/countries/${randomCountry.iso2}`)
        .expect(200)
        .expect([randomCountry]);
    });

    test('when sending :country param as iso3 code of country', () => {
      return request(app.getHttpServer())
        .get(`/api/countries/${randomCountry.iso3}`)
        .expect(200)
        .expect([randomCountry]);
    });

    test('when no country for sent :country param found', () => {
      const countryParamValue = 'Asgard';

      return request(app.getHttpServer())
        .get(`/api/countries/${countryParamValue}`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Could not find country for: ${countryParamValue}`,
          error: 'Not Found',
        });
    });
  });

  describe('[GET] /api/countries/:country/neighbours should respond correctly', () => {
    const [Alonia, Nordern, Middelland, Southelle] = mockCountries;

    test.each`
      case                                 | matchField
      ${'sending :country param as name'}  | ${'name'}
      ${'sending :country param as iso2'}  | ${'iso2'}
      ${'sending :country param as isoe3'} | ${'iso3'}
    `('when $case and country has no neighbour countries', ({ matchField }) => {
      const searchValue = Alonia[matchField];

      return request(app.getHttpServer())
        .get(`/api/countries/${searchValue}/neighbours`)
        .expect(200)
        .expect({
          country: Alonia,
          neighbours: [],
        });
    });

    test.each`
      case                                 | matchField
      ${'sending :country param as name'}  | ${'name'}
      ${'sending :country param as iso2'}  | ${'iso2'}
      ${'sending :country param as isoe3'} | ${'iso3'}
    `('when $case and country has neighbour countries', ({ matchField }) => {
      const searchValue = Middelland[matchField];

      return request(app.getHttpServer())
        .get(`/api/countries/${searchValue}/neighbours`)
        .expect(200)
        .expect({
          country: Middelland,
          neighbours: [Nordern, Southelle],
        });
    });

    test('when no country for sent :country param found', () => {
      const countryParamValue = 'Asgard';

      return request(app.getHttpServer())
        .get(`/api/countries/${countryParamValue}/neighbours`)
        .expect(404)
        .expect({
          statusCode: 404,
          message: `Could not find country for: ${countryParamValue}`,
          error: 'Not Found',
        });
    });
  });
});
