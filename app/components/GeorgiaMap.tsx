'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import DeckGL from '@deck.gl/react';
import { IconLayer, TextLayer } from '@deck.gl/layers';

const DATA = [
  { position: [-84.39, 33.75], name: 'Atlanta' },
  { position: [-81.09, 32.08], name: 'Savannah' }
];

const ICON_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png';

const GEORGIA_BOUNDS: [[number, number], [number, number]] = [
  [-85.6052, 30.3558],
  [-80.7514, 35.0007]
];

export default function GeorgiaMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [viewState, setViewState] = useState({
    longitude: -83.5,
    latitude: 32.7,
    zoom: 6,
    pitch: 0,
    bearing: 0
  });

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

      map.addSource('counties', {
        type: 'geojson',
        data: '/data/ARC_CountiesConverted.json'
      });

      map.addLayer({
        id: 'counties-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.2
        }
      });

      map.addLayer({
        id: 'counties-outline',
        type: 'line',
        source: 'counties',
        paint: {
          'line-color': '#1e40af',
          'line-width': 1
        }
      });
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

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

  const iconLayer = new IconLayer({
    id: 'icon-layer',
    data: DATA,
    pickable: true,
    iconAtlas: ICON_URL,
    iconMapping: {
      marker: { x: 0, y: 0, width: 128, height: 128, mask: true }
    },
    getIcon: () => 'marker',
    sizeScale: 4,
    getPosition: d => d.position,
    getSize: () => 3,
    getColor: () => [0, 128, 255],
    onClick: info => info.object && alert(info.object.name)
  });

  const textLayer = new TextLayer({
    id: 'text-layer',
    data: DATA,
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: () => viewState.zoom * 2,
    getColor: () => [0, 128, 255],
    getTextAnchor: () => 'start',
    getAlignmentBaseline: () => 'bottom'
  });

  return (
    <div className="relative w-full h-[650px] rounded-lg overflow-hidden">
      <div
        ref={mapContainer}
        className="absolute inset-0 w-full h-full rounded-lg z-0"
      />
      <DeckGL
        viewState={viewState}
        controller={false}
        layers={[iconLayer, textLayer]}
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