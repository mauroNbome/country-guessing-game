import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import countriesData from '../data/countries.json';
import { Country, CountriesData } from '../types';
import * as turf from '@turf/turf';

interface MapComponentProps {
  selectedCountry: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedCountry }) => {
  const mapRef = useRef<any>(null);
  const geoJsonRef = useRef<any>(null);

  const FlyToCountry = () => {
    const map = useMap();

    useEffect(() => {
      if (selectedCountry) {
        const country = (countriesData as CountriesData).features.find(
          (feature) => feature.properties.name === selectedCountry
        );
        if (country) {
          const bbox = turf.bbox(country);
          const area = turf.area(country);
          
          let zoomLevel = 5; // Default zoom level

          if (area > 1000000000) {
            zoomLevel = 3; // For very large countries
          } else if (area > 100000000) {
            zoomLevel = 4; // For large countries
          } else if (area > 10000000) {
            zoomLevel = 5; // For medium-large countries
          } else if (area > 1000000) {
            zoomLevel = 7; // For medium countries
          } else if (area > 100000) {
            zoomLevel = 9; // For small countries
          } else if (area > 10000) {
            zoomLevel = 11; // For very small countries
          } else {
            zoomLevel = 13; // For extremely small countries
          }

          map.flyToBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]], { maxZoom: zoomLevel });
        }
      }
    }, [selectedCountry, map]);

    useEffect(() => {
      if (map) {
        map.scrollWheelZoom.disable();
        map.dragging.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        map.touchZoom.disable();
      }
    }, [map]);

    return null;
  };

  const onEachCountry = (country: Country, layer: any) => {
    const countryName = country.properties.name;

    if (countryName === selectedCountry) {
      layer.setStyle({
        fillColor: 'blue',
        fillOpacity: 0.7,
        color: 'blue',
        weight: 2,
      });
    } else {
      layer.setStyle({
        fillColor: 'grey',
        fillOpacity: 0.2,
        color: 'grey',
        weight: 1,
      });
    }
  };

  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.eachLayer((layer: any) => {
        const countryName = layer.feature.properties.name;
        if (countryName === selectedCountry) {
          layer.setStyle({
            fillColor: 'blue',
            fillOpacity: 0.7,
            color: 'blue',
            weight: 2,
          });
        } else {
          layer.setStyle({
            fillColor: 'grey',
            fillOpacity: 0.2,
            color: 'grey',
            weight: 1,
          });
        }
      });
    }
  }, [selectedCountry]);

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: '80vh', width: '100%' }} ref={mapRef}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
      />
      <GeoJSON data={countriesData as CountriesData} onEachFeature={onEachCountry} ref={geoJsonRef} />
      <FlyToCountry />
    </MapContainer>
  );
};

export default MapComponent;
