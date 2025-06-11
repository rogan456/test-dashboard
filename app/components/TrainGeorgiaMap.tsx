'use client';
import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import regionBoundariesData from '../data/Regional_Commission_Boundaries.json';
import countyBoundariesData from '../data/ARC_CountiesConverted.json';

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

export default function TrainGeorgiaMap() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [showCounties, setShowCounties] = useState(false);

  const regionLayer = new GeoJsonLayer({
    id: 'regions',
    data: (regionBoundariesData as any).default ?? regionBoundariesData,
    stroked: true,
    filled: true,
    getFillColor: (f: any): [number, number, number, number] => {
      const idx = (f.properties?.Reg_Num ?? 1) % districtBlues.length;
      return [...districtBlues[idx].slice(0, 3), 80] as [number, number, number, number];
    },
    getLineColor: (f: any): [number, number, number, number] => {
      const idx = (f.properties?.Reg_Num ?? 1) % districtBlues.length;
      return districtBlues[idx].slice(0, 4) as [number, number, number, number];
    },
    lineWidthMinPixels: 3,
    pickable: false,
  });

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

  const layers = showCounties ? [regionLayer, countyLayer] : [regionLayer];

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
      </DeckGL>
    </div>
  );
}