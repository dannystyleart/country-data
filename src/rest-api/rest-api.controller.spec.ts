import { Test, TestingModule } from '@nestjs/testing';
import { RestApiController } from './rest-api.controller';
import { CountriesService } from '../country/countries.service';
import { CountrySearchPathParamDto } from './dto/countries-dto';

const mockCountriesService = () => ({
  getCountries: jest.fn(),
  findCountry: jest.fn(),
  getCountryNeighbours: jest.fn(),
});

describe('RestApiController', () => {
  let appController: RestApiController;
  let mockedCountriesService: ReturnType<typeof mockCountriesService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RestApiController],
      providers: [
        {
          provide: CountriesService,
          useFactory: mockCountriesService,
        },
      ],
    }).compile();

    mockedCountriesService = app.get(CountriesService);
    appController = app.get<RestApiController>(RestApiController);
  });

  describe('listCountries', () => {
    beforeEach(() => {
      mockedCountriesService.getCountries.mockClear();
    });

    test('should return result of countryService.findCountry when search string provided', () => {
      const mockedReturnValue = 'return of countryService.getCountries()';
      mockedCountriesService.getCountries.mockReturnValueOnce(
        mockedReturnValue,
      );

      expect(appController.listCountries()).toBe(mockedReturnValue);
      expect(mockedCountriesService.getCountries).toHaveBeenCalled();
    });
  });

  describe('findCountry', () => {
    test('should return result of countryService.findCountry called correctly', () => {
      const mockedReturnValue = 'return of countryService.findCountry()';
      const testSearch: CountrySearchPathParamDto = { country: 'spacey   ' };
      const expectedMethodParam = testSearch.country.trim();

      mockedCountriesService.findCountry.mockReturnValueOnce(mockedReturnValue);

      expect(appController.findCountry(testSearch)).toBe(mockedReturnValue);
      expect(mockedCountriesService.findCountry).toHaveBeenCalledWith(
        expectedMethodParam,
      );
    });
  });

  describe('findCountryNeighbours', () => {
    test('should return result of countryService.getCountryNeighhbours called correctly', () => {
      const mockedReturnValue =
        'return of countryService.getCountryNeighbours()';
      const testSearch: CountrySearchPathParamDto = { country: 'spacey   ' };
      const expectedMethodParam = testSearch.country.trim();

      mockedCountriesService.getCountryNeighbours.mockReturnValueOnce(
        mockedReturnValue,
      );

      expect(appController.findCountryNeighbours(testSearch)).toBe(
        mockedReturnValue,
      );
      expect(mockedCountriesService.getCountryNeighbours).toHaveBeenCalledWith(
        expectedMethodParam,
      );
    });
  });
});
