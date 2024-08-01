import { GeoJsonObject, Feature, Geometry } from 'geojson';

export interface CountryProperties {
  name: string;
}

export interface Country extends Feature<Geometry, CountryProperties> {}

export interface CountriesData extends GeoJsonObject {
  type: 'FeatureCollection';
  features: Country[];
}
