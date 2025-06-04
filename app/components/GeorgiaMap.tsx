'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import regionBoundariesData from '../data/Regional_Commission_Boundaries.json';
import countyBoundariesData from '../data/ARC_CountiesConverted.json';

const GEORGIA_BOUNDS: [[number, number], [number, number]] = [
  [-85.6052, 30.3558],
  [-80.7514, 35.0007]
];

const INITIAL_VIEW_STATE = {
  longitude: -83.5,
  latitude: 32.7,
  zoom: 6,
  pitch: 0,
  bearing: 0
};

// Array of blue shades for districts (add more if needed)
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

type ActivityRow = {
  CityId: string | number;
  CityName: string;
  District: string | number;
  ActivityDate: string;
  latitude?: number;
  longitude?: number;
  // ...other fields
};

export default function GeorgiaMap({ activityData = [] }: { activityData?: ActivityRow[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [showCounties, setShowCounties] = useState(false);

  // Reset view to Georgia bounds
  const handleResetView = () => {
    setViewState(INITIAL_VIEW_STATE);
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      minZoom: 5,
      maxZoom: 18,
      maxBounds: GEORGIA_BOUNDS
    });

    map.fitBounds(GEORGIA_BOUNDS, { padding: 40, duration: 0 });

    map.on('load', () => {
      map.getStyle().layers?.forEach(layer => {
        if (layer.type === 'symbol') {
          map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-right');
    });

    map.on('move', () => {
      const center = map.getCenter();
      setViewState({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing()
      });
    });

    return () => map.remove();
  }, []);

  // --- DeckGL GeoJsonLayers ---
  const countyLayer = new GeoJsonLayer({
    id: 'counties',
    data: (countyBoundariesData as any).default ?? countyBoundariesData,
    stroked: true,
    filled: true,
    getFillColor: [37, 99, 235, 60], // blue with opacity
    getLineColor: [30, 64, 175, 200], // darker blue
    lineWidthMinPixels: 1,
    pickable: false,
  });

  const regionLayer = new GeoJsonLayer({
    id: 'regions',
    data: (regionBoundariesData as any).default ?? regionBoundariesData,
    stroked: true,
    filled: false,
    getLineColor: (f: any): [number, number, number, number] => {
      // Use Reg_Num or similar property to pick a blue shade
      const idx = (f.properties?.Reg_Num ?? 1) % districtBlues.length;
      return districtBlues[idx] as [number, number, number, number];
    },
    lineWidthMinPixels: 3,
    pickable: false,
  });

  // Only show regionLayer by default, add countyLayer if toggled
  const layers = showCounties ? [countyLayer, regionLayer] : [regionLayer];

  return (
    <div className="relative w-full h-[650px] rounded-lg overflow-hidden">
      {/* Toggle for counties and reset button */}
      <div className="absolute bottom-4 left-4 z-10 bg-white bg-opacity-90 rounded shadow px-4 py-2 flex flex-col gap-2">
        <label className=" flex items-center gap-2 cursor-pointer">
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
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full rounded-lg z-0"
      />
      <DeckGL
        viewState={viewState}
        controller={false}
        layers={layers}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}