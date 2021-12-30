import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CountriesService } from './countries.service';

const mockCountriesService = () => ({
  getCountries: jest.fn(),
  findCountry: jest.fn(),
  getCountryNeighbours: jest.fn(),
});

describe('AppController', () => {
  let appController: AppController;
  let mockedCountriesService: ReturnType<typeof mockCountriesService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: CountriesService,
          useFactory: mockCountriesService,
        },
      ],
    }).compile();

    mockedCountriesService = app.get(CountriesService);
    appController = app.get<AppController>(AppController);
  });

  describe('listCountries', () => {
    beforeEach(() => {
      mockedCountriesService.findCountry.mockClear();
      mockedCountriesService.getCountries.mockClear();
    });

    test('should return result of countryService.findCountry when search string provided', () => {
      const mockedReturnValue = 'return of findCountry()';
      const testSearchValue = 'hello  ';
      const expectedMethodParam = testSearchValue.trim();

      mockedCountriesService.findCountry.mockReturnValueOnce(mockedReturnValue);

      expect(appController.listCountries(testSearchValue)).toBe(
        mockedReturnValue,
      );
      expect(mockedCountriesService.findCountry).toHaveBeenCalledWith(
        expectedMethodParam,
      );
      expect(mockedCountriesService.getCountries).not.toHaveBeenCalled();
    });

    test('should return result of countryService.getCountries when search string is not provided', () => {
      const mockedReturnValue = 'return of getCountries()';
      const testSearchValue = '';

      mockedCountriesService.getCountries.mockReturnValueOnce(
        mockedReturnValue,
      );

      expect(appController.listCountries(testSearchValue)).toBe(
        mockedReturnValue,
      );

      expect(mockedCountriesService.getCountries).toHaveBeenCalledWith();
      expect(mockedCountriesService.findCountry).not.toHaveBeenCalled();
    });
  });

  describe('findCountry', () => {
    test('should return result of countryService.METHOD called correctly', () => {
      const mockedReturnValue = 'return of findCountry()';
      const testSearch = 'spacey   ';
      const expectedMethodParam = testSearch.trim();

      mockedCountriesService.findCountry.mockReturnValueOnce(mockedReturnValue);

      expect(appController.findCountry(testSearch)).toBe(mockedReturnValue);
      expect(mockedCountriesService.findCountry).toHaveBeenCalledWith(
        expectedMethodParam,
      );
    });
  });

  describe('findCountryNeighbours', () => {
    test('should return result of countryService.METHOD called correctly', () => {
      const mockedReturnValue = 'return of getCountryNeighbours()';
      const testSearch = 'spacey   ';
      const expectedMethodParam = testSearch.trim();

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
