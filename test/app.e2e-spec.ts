import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CountryDto } from 'src/dto/country-dto';
import * as request from 'supertest';
import mockCountries from '../__fixtures__/countries';
import mockLandborders from '../__fixtures__/landborders';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('COUNTRY_LIST')
      .useValue(mockCountries)
      .overrideProvider('LANDBORDER_LIST')
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
    const [firstCountry, countryWithNoBorders, countryWithBorders] =
      mockCountries;

    test.each`
      case                                 | matchField
      ${'sending :country param as name'}  | ${'name'}
      ${'sending :country param as iso2'}  | ${'iso2'}
      ${'sending :country param as isoe3'} | ${'iso3'}
    `('when $case and country has no neighbour countries', ({ matchField }) => {
      const searchValue = countryWithNoBorders[matchField];

      return request(app.getHttpServer())
        .get(`/api/countries/${searchValue}/neighbours`)
        .expect(200)
        .expect({
          country: countryWithNoBorders,
          neighbours: [],
        });
    });

    test.each`
      case                                 | matchField
      ${'sending :country param as name'}  | ${'name'}
      ${'sending :country param as iso2'}  | ${'iso2'}
      ${'sending :country param as isoe3'} | ${'iso3'}
    `('when $case and country has neighbour countries', ({ matchField }) => {
      const searchValue = countryWithBorders[matchField];

      return request(app.getHttpServer())
        .get(`/api/countries/${searchValue}/neighbours`)
        .expect(200)
        .expect({
          country: countryWithBorders,
          neighbours: [countryWithNoBorders, countryWithBorders],
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
