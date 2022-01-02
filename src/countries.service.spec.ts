import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';

const mockCountryList = [
  { name: 'Westernlands', iso2: 'WS', iso3: 'WLS' },
  { name: 'Crownlands', iso2: 'CL', iso3: 'CRW' },
  { name: 'Rock', iso2: 'RK', iso3: 'RCK' },
];
const mockLandborderList = {
  WLS: ['CRW'],
  CRW: [],
  RCK: ['CRW', 'RCK'],
};

describe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'COUNTRY_LIST', useValue: mockCountryList },
        { provide: 'LANDBORDER_LIST', useValue: mockLandborderList },
        CountriesService,
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  describe('getCountries', () => {
    test('should return all countries provided in COUNTRY_LIST provider', () => {
      expect(service.getCountries()).toBe(mockCountryList);
    });
  });

  describe('findCountry', () => {
    let randomCountry;
    beforeEach(() => {
      randomCountry =
        mockCountryList[Math.floor(Math.random() * mockCountryList.length)];
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
    test('should throw error when country not found', () => {
      const search = 'FOO';
      const expectedError = `Could not find country for: ${search}`;

      expect(() => service.getCountryNeighbours(search)).toThrowError(
        expectedError,
      );
    });

    test('should return the correct data structure', () => {
      expect(service.getCountryNeighbours('Westernlands')).toMatchObject({
        country: { name: 'Westernlands', iso2: 'WS', iso3: 'WLS' },
        neighbours: [{ name: 'Crownlands', iso2: 'CL', iso3: 'CRW' }],
      });
    });
  });
});
