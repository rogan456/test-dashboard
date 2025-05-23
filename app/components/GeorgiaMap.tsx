'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const GeorgiaMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const georgiaBounds: maplibregl.LngLatBoundsLike = [
      [-85.6052, 30.3558],
      [-80.7514, 35.0007],
    ];

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      maxBounds: georgiaBounds,
      minZoom: 1,
      maxZoom: 12,
    });

    map.fitBounds(georgiaBounds, {
      padding: 50,
      duration: 0,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-64 sm:h-80 md:h-96 lg:h-[550px] rounded-lg"
    />
  );
};

export default GeorgiaMap;