// src/types.ts
export interface CountryProperties {
    name: string;
  }
  
  export interface CountryGeometry {
    type: string;
    coordinates: any;
  }
  
  export interface Country {
    type: string;
    properties: CountryProperties;
    geometry: CountryGeometry;
  }
  
  export interface CountriesData {
    type: string;
    features: Country[];
  }
  