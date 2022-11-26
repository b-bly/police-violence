import React from 'react'
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import { Position } from '../types';
import { ScaleQuantile } from 'd3-scale'

interface MapProps {
  data: any
  position: Position,
  handleMoveEnd: (position: Position) => void,
  geoUrl: string,
  colorScale: ScaleQuantile<number>,
  colorMap: string[],
}

export const Map: React.FC<MapProps> = ({
  data,
  position,
  handleMoveEnd,
  geoUrl,
  colorScale,
  colorMap
}) => {
  return (
    <ComposableMap
      projection="geoAlbersUsa"
    >
      <ZoomableGroup
        zoom={position.zoom}
        center={position.coordinates}
        onMoveEnd={handleMoveEnd}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo: any) => {
              const cur = data[geo.id]; // id == fips county
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={cur ? colorMap[colorScale(cur) as number] : "rgb(61, 61, 61)"}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}