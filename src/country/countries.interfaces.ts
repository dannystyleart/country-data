export interface Country {
  name: string;
  iso2: string;
  iso3: string;
}

export interface CountryNeighbourhood {
  country: Country;
  neighbours: Array<Country>;
}

export interface LandborderMap {
  [key: Country['iso3']]: Array<Country['iso3']>;
}
