import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from '../country/countries.service';
import { CountriesResolver } from './countries.resolver';

const mockCountriesService = () => ({
  getCountries: jest.fn(),
  findCountry: jest.fn(),
  getCountryNeighbours: jest.fn(),
});

describe('CountriesResolver', () => {
  let resolver: CountriesResolver;
  let countryService: jest.Mocked<CountriesService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesResolver,
        {
          provide: CountriesService,
          useFactory: mockCountriesService,
        },
      ],
    }).compile();

    resolver = moduleRef.get<CountriesResolver>(CountriesResolver);
    countryService = moduleRef.get(CountriesService);
  });

  describe('findCountry', () => {
    beforeEach(() => {
      countryService.findCountry.mockReset();
    });

    test('Calls countriesService.findCountry with search string', async () => {
      countryService.findCountry.mockReturnValueOnce([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);

      await resolver.findCountry('some search');

      expect(countryService.findCountry).toHaveBeenCalledWith('some search');
    });

    test('Returns found country received from countriesService', async () => {
      countryService.findCountry.mockReturnValueOnce([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);

      await expect(resolver.findCountry('some search')).resolves.toEqual({
        name: 'Country1',
        iso2: 'c1',
        iso3: 'c11',
      });
    });

    test('Rejects with error if no country found', async () => {
      countryService.findCountry.mockReturnValueOnce([]);

      await expect(resolver.findCountry('some search')).rejects.toThrow(
        'Country not found',
      );
    });
  });

  describe('allCountry', () => {
    test('Returns all countries by calling CountriesService.getCountries', () => {
      countryService.getCountries.mockReturnValueOnce([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);

      const resolverResult = resolver.allCountry();

      expect(countryService.getCountries).toHaveBeenCalled();
      expect(resolverResult).toEqual([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);
    });
  });

  describe('getCountryNeighbours', () => {
    beforeEach(() => {
      countryService.findCountry.mockReset();
    });

    test('Fetches country by search string', async () => {
      countryService.findCountry.mockReturnValueOnce([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);

      await resolver.getCountryNeighbours('some search');

      expect(countryService.findCountry).toHaveBeenCalledWith('some search');
    });

    test('Rejects with error if no country found', async () => {
      countryService.findCountry.mockReturnValueOnce([]);

      await expect(resolver.findCountry('some search')).rejects.toThrow(
        'Country not found',
      );
    });

    test('Fetches country neighbours by calling countriesService.getCountryNeighbours', async () => {
      countryService.findCountry.mockReturnValueOnce([
        { name: 'Country1', iso2: 'c1', iso3: 'c11' },
      ]);
      countryService.getCountryNeighbours.mockReturnValueOnce({
        country: { name: 'Country1', iso2: 'c1', iso3: 'c11' },
        neighbours: [{ name: 'Country2', iso2: 'c2', iso3: 'c22' }],
      });

      const resolverResult = await resolver.getCountryNeighbours('some search');

      expect(countryService.findCountry).toHaveBeenCalledWith('some search');
      expect(countryService.getCountryNeighbours).toHaveBeenCalledWith(
        'some search',
      );

      expect(resolverResult).toEqual({
        country: { name: 'Country1', iso2: 'c1', iso3: 'c11' },
        neighbours: [{ name: 'Country2', iso2: 'c2', iso3: 'c22' }],
      });
    });
  });
});
