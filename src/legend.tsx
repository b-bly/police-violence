import React from 'react';

const style: any = {
  legendContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto'
  },
  legendRow: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'white'
  },
  colorSquare: {
    width: '1rem',
    height: '1rem',
    backgroundColor: 'red',
    padding: '.25rem'
  },
  legendLabel: {
    fontSize: '1rem',
    padding: '.25rem',
    whiteSpace: 'nowrap'
  },
  legendCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    borderRadius: '.25rem',
    padding: '.5rem',
    margin: '.5rem'
  }
}

interface legendProps {
  colorMap: string[],
  colorScaleQuantiles: any,
  label: string
}

export const Legend: React.FC<legendProps> = ({ colorMap, colorScaleQuantiles, label }) => {
  if (colorScaleQuantiles) console.log(colorScaleQuantiles);
  return (
    <div style={style.legendContainer}>
      <div style={style.legendCard}>
        {colorMap.map((color, i) =>
          <div style={style.legendRow} key={i.toString()}>
            <div style={{ ...style.colorSquare, backgroundColor: color }} ></div>
        {colorScaleQuantiles && <div style={style.legendLabel}>{parseInt(colorScaleQuantiles[i])} people</div> }
          </div>
        )}
      </div>
    </div>
  );
}