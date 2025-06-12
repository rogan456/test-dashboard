'use client';
import { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import regionBoundariesData from '../data/Regional_Commission_Boundaries.json';
import countyBoundariesData from '../data/ARC_CountiesConverted.json';
import cities from '../data/cities.json';
import bbox from '@turf/bbox';


const INITIAL_VIEW_STATE = {
  longitude: -83.5,
  latitude: 32.7,
  zoom: 6,
  pitch: 0,
  bearing: 0
};

const districtBlues = [
  [37, 99, 235, 200],
  [59, 130, 246, 200],
  [96, 165, 250, 200],
  [147, 197, 253, 200],
  [191, 219, 254, 200],
  [30, 64, 175, 200],
  [29, 78, 216, 200],
  [56, 189, 248, 200],
  [14, 165, 233, 200],
  [2, 132, 199, 200],
  [3, 105, 161, 200],
  [7, 89, 133, 200],
  [59, 130, 246, 200],
  [96, 165, 250, 200],
];

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

type CityActivity = { CityName: string; count: number; Population?: string };
type GeorgiaMapProps = {
  cityActivityData?: CityActivity[];
  zoomToCities?: string[];
  onCitySelect?: (cityName: string) => void;
};

export default function GeorgiaMap({ cityActivityData = [], zoomToCities, onCitySelect }: GeorgiaMapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [showCounties, setShowCounties] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  // Districts as base map (fill + outline)
  const regionLayer = new GeoJsonLayer({
    id: 'regions',
    data: (regionBoundariesData as any).default ?? regionBoundariesData,
    stroked: true,
    filled: true,
    getFillColor: (f: any): [number, number, number, number] => {
      const idx = (f.properties?.Reg_Num ?? 1) % districtBlues.length;
      return [...districtBlues[idx].slice(0, 3), 80] as [number, number, number, number]; // lighter fill
    },
    getLineColor: (f: any): [number, number, number, number] => {
      const idx = (f.properties?.Reg_Num ?? 1) % districtBlues.length;
      return districtBlues[idx].slice(0, 4) as [number, number, number, number];
    },
    lineWidthMinPixels: 3,
    pickable: false,
  });

  // Optional: County lines
  const countyLayer = new GeoJsonLayer({
    id: 'counties',
    data: (countyBoundariesData as any).default ?? countyBoundariesData,
    stroked: true,
    filled: false,
    getLineColor: [30, 64, 175, 200],
    lineWidthMinPixels: 1,
    pickable: false,
    visible: showCounties,
  });

  // Build city coordinate lookup using CompanySort (UPPERCASE)
  const cityCoordMap = Object.fromEntries(
    cities.map((city: any) => [city.CompanySort.toUpperCase(), city])
  );

  // Prepare city points for IconLayer
  const cityPoints = (cityActivityData as CityActivity[])
    .map((city: CityActivity) => {
      const cityInfo = cityCoordMap[city.CityName?.toUpperCase()];
      if (!cityInfo) return null;
      return {
        coordinates: [parseFloat(cityInfo.LONGITUDE), parseFloat(cityInfo.LATITUDE)],
        name: city.CityName,
        count: city.count,
        population: city.Population || 'N/A', // Use Population if available
      };
    })
    .filter(Boolean);

  

 

  useEffect(() => {
  if (!zoomToCities || zoomToCities.length === 0) return;

  if (zoomToCities.length === 1) {
  // Zoom to the district of the single selected city
  const cityName = zoomToCities[0];
  const cityInfo = cityCoordMap[cityName.toUpperCase()];
  if (!cityInfo) return;

  const districtNum = cityInfo.GMADIST;
  const features = (regionBoundariesData as any).features ?? [];
  const districtFeature = features.find(
    (feature: any) => feature.properties.Reg_Num === districtNum
  );

  if (districtFeature) {
    const [minLng, minLat, maxLng, maxLat] = bbox(districtFeature);
    const longitude = (minLng + maxLng) / 2;
    const latitude = (minLat + maxLat) / 2;
    const lonDiff = Math.abs(maxLng - minLng);
    const latDiff = Math.abs(maxLat - minLat);
    // Limit zoom so it never goes closer than 7 (district level)
    const zoom = Math.min(
      7, // <-- never zoom in closer than 7
      Math.max(
        6,
        8 - Math.max(Math.log2(lonDiff + 0.01), Math.log2(latDiff + 0.01))
      )
    );
    setViewState(vs => ({
      ...vs,
      longitude,
      latitude,
      zoom,
      transitionDuration: 1000
    }));
  }
  } else {
    // Zoom to fit all selected cities
    const coords = zoomToCities
      .map(cityName => {
        const cityInfo = cityCoordMap[cityName.toUpperCase()];
        if (cityInfo && cityInfo.LATITUDE && cityInfo.LONGITUDE) {
          return [parseFloat(cityInfo.LONGITUDE), parseFloat(cityInfo.LATITUDE)];
        }
        return null;
      })
      .filter(Boolean) as [number, number][];

    if (coords.length === 0) return;

    const lons = coords.map(([lon]) => lon);
    const lats = coords.map(([, lat]) => lat);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const centerLon = (minLon + maxLon) / 2;
    const centerLat = (minLat + maxLat) / 2;
    const lonDiff = Math.abs(maxLon - minLon);
    const latDiff = Math.abs(maxLat - minLat);
    const zoom = Math.min(
    7,
    Math.max(
      6,
      8 - Math.max(Math.log2(lonDiff + 0.01), Math.log2(latDiff + 0.01))
    )
  );
    setViewState(vs => ({
      ...vs,
      longitude: centerLon,
      latitude: centerLat,
      zoom,
      transitionDuration: 1000
    }));
  }
}, [zoomToCities]);


  const scatterLayer = new ScatterplotLayer({
  id: 'city-activity-dots',
  data: cityPoints,
  pickable: true,
  getPosition: d => d.coordinates,
  getRadius: d => {

    const base = 5000 + Math.min(20000, d.count * 2000);
    return base / Math.pow(2, viewState.zoom - 6);
  },
  getFillColor: [0, 99, 255, 200],
  onHover: setHoverInfo,
  onClick: info => {
    if (info.object && typeof onCitySelect === 'function') {
      onCitySelect(info.object.name);
    }
  }
});


  function renderTooltip(
  info: {
    x: number;
    y: number;
    object?: {
      name?: string; // This is CitySort
      count?: number;
      population?: number | string;
    };
  } | null
) {
  if (!info || !info.object) return null;
  const { x, y, object } = info;
  const formattedName = object.name
    ? object.name.charAt(0).toUpperCase() + object.name.slice(1).toLowerCase()
    : '';
  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      background: 'white',
      padding: 8,
      borderRadius: 4,
      pointerEvents: 'none',
      zIndex: 20,
      minWidth: 120
    }}>
      <div><strong>City Name:</strong> {formattedName}</div>
      <div><strong>No of Activities:</strong> {object.count}</div>
      <div><strong>Population:</strong> {object.population ?? 'N/A'}</div>
    </div>
  );
}
  const layers = showCounties
  ? [regionLayer, countyLayer, scatterLayer]
  : [regionLayer, scatterLayer];

  // Reset view handler
  const handleResetView = () => {
    setViewState(INITIAL_VIEW_STATE);
  };

  return (
    <div className="relative w-full h-[650px] rounded-lg overflow-hidden">
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 rounded shadow px-4 py-2 flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCounties}
            onChange={() => setShowCounties(v => !v)}
            className="accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Show County Lines</span>
        </label>
        <button
          onClick={handleResetView}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          Reset View
        </button>
      </div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        controller={true}
        layers={layers}
        onViewStateChange={({ viewState }) => {
          if (
            viewState &&
            typeof (viewState as any).longitude === 'number' &&
            typeof (viewState as any).latitude === 'number' &&
            typeof (viewState as any).zoom === 'number' &&
            typeof (viewState as any).pitch === 'number' &&
            typeof (viewState as any).bearing === 'number'
          ) {
            const vs = viewState as {
              longitude: number;
              latitude: number;
              zoom: number;
              pitch: number;
              bearing: number;
            };
            setViewState({
              longitude: vs.longitude,
              latitude: vs.latitude,
              zoom: vs.zoom,
              pitch: vs.pitch,
              bearing: vs.bearing,
            });
          }
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Map reuseMaps mapStyle={MAP_STYLE} />
        {hoverInfo && renderTooltip(hoverInfo)}
      </DeckGL>
    </div>
  );
}