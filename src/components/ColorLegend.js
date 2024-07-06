import React from 'react';
import { scaleLinear } from 'd3-scale';

const ColorLegend = () => {
  // Define the color scale domain and range as per your colorScale
  const colorScale = scaleLinear()
    .domain([0, 100000, 1000000, 5000000, 10000000, 50000000])
    .range(['#e5f5f9', '#99d8c9', '#2ca25f', '#006d2c', '#00441b']);

  // Define legend labels
  const legendLabels = [
    { color: '#e5f5f9', label: '0 - 100,000' },
    { color: '#99d8c9', label: '100,000 - 1,000,000' },
    { color: '#2ca25f', label: '1,000,000 - 5,000,000' },
    { color: '#006d2c', label: '5,000,000 - 10,000,000' },
    { color: '#00441b', label: '10,000,000+' },
  ];

  return (
    <div className="legend">
      <h3>Legend</h3>
      {legendLabels.map((legend, index) => (
        <div key={index} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: legend.color }} />
          <div className="legend-label">{legend.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ColorLegend;
