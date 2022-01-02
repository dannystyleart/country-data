import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import {
  CountryListProviderToken,
  LandborderListProviderToken,
} from './dataset/constants';
import mockCountries from './dataset/__fixtures__/countries';
import mockLandborders from './dataset/__fixtures__/landborders';

describe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: CountryListProviderToken, useValue: mockCountries },
        { provide: LandborderListProviderToken, useValue: mockLandborders },
        CountriesService,
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  describe('getCountries', () => {
    test(`should return all countries provided in ${CountryListProviderToken} provider`, () => {
      expect(service.getCountries()).toBe(mockCountries);
    });
  });

  describe('findCountry', () => {
    let randomCountry;
    beforeEach(() => {
      randomCountry =
        mockCountries[Math.floor(Math.random() * mockCountries.length)];
    });

    test.each`
      case                                        | field
      ${'by 2 character matching the iso2 field'} | ${'iso2'}
      ${'by 3 character matching the iso3 field'} | ${'iso3'}
      ${'by name field'}                          | ${'name'}
    `('should be able to find a country $case', ({ field }) => {
      expect(service.findCountry(randomCountry[field])).toStrictEqual([
        randomCountry,
      ]);
    });

    test('should throw an error when a country not found', () => {
      const search = 'FOO';
      const expectedError = `Could not find country for: ${search}`;

      expect(() => service.findCountry(search)).toThrowError(expectedError);
    });
  });

  describe('getCountryNeighbours', () => {
    const [_, Nordern, Middelland, Southelle] = mockCountries;
    test('should throw error when country not found', () => {
      const search = 'FOO';
      const expectedError = `Could not find country for: ${search}`;

      expect(() => service.getCountryNeighbours(search)).toThrowError(
        expectedError,
      );
    });

    test('should return the correct data structure', () => {
      expect(service.getCountryNeighbours(Middelland.name)).toMatchObject({
        country: Middelland,
        neighbours: [Nordern, Southelle],
      });
    });
  });
});
