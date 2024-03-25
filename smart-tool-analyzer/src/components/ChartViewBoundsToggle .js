import React, { useState, useEffect } from 'react';

const ChartViewBoundsToggle = ({ chartData , chartRef }) => {
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(1);

  useEffect(() => {
    setStartPosition(chartData[0]?.x ?? 0); // Set start position to the first x-axis value of the chart
    setEndPosition(chartData[chartData.length - 1]?.x ?? 1); // Set end position to the last x-axis value of the chart
  }, [chartData]);

  const calculateValues = () => {
    if (chartData && chartData.length > 0) {
      const properties = ['tension', 'torsion', 'bendingMomentY', 'temperature'];
      const initialValues = Object.fromEntries(properties.map(property => [property, { max: -Infinity, min: Infinity, mean: 0, slope: 0 }]));

      const filteredData = chartData.filter(data => data.x >= startPosition && data.x <= endPosition);

      const updatedValues = filteredData.reduce((acc, curr, index, array) => {
        properties.forEach(property => {
          // Update max and min values
          acc[property].max = Math.max(acc[property].max, curr[property]);
          acc[property].min = Math.min(acc[property].min, curr[property]);

          // Update mean value
          acc[property].mean += curr[property];

          // Update slope value (except for the last data point)
          if (index < array.length - 1) {
            const nextValue = array[index + 1][property];
            acc[property].slope += (nextValue - curr[property]) / (index + 1);
          }
        });
        return acc;
      }, initialValues);

      // Calculate mean value (average)
      properties.forEach(property => {
        updatedValues[property].mean /= filteredData.length;
      });

      setCalculatedValues(updatedValues);
      setShowTable(true); // Show the table after calculation
    }
  };

  const handleStartPositionChange = (e) => {
    const value = parseFloat(e.target.value);
    setStartPosition(value);
    if (value > endPosition) {
      setEndPosition(value);
    }
  };

  const handleEndPositionChange = (e) => {
    const value = parseFloat(e.target.value);
    setEndPosition(value);
    if (value < startPosition) {
      setStartPosition(value);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="mb-4 w-full max-w-lg">
        <input type="range" min={chartData[0]?.x ?? 0} max={chartData[chartData.length - 1]?.x ?? 1} step="0.01" value={startPosition} onChange={handleStartPositionChange} className="w-full" />
      </div>
      <div className="mb-4 w-full max-w-lg">
        <input type="range" min={startPosition} max={chartData[chartData.length - 1]?.x ?? 1} step="0.01" value={endPosition} onChange={handleEndPositionChange} className="w-full" />
      </div>
      <div className="mb-4 w-full max-w-lg">
        <button onClick={calculateValues} className="btn-calculate">Calculate Values</button>
      </div>
      {showTable && (
        <div className="w-full max-w-lg overflow-x-auto">
          <h2>Calculated Values</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-200 px-4 py-2">Property</th>
                <th className="bg-gray-200 px-4 py-2">Max</th>
                <th className="bg-gray-200 px-4 py-2">Min</th>
                <th className="bg-gray-200 px-4 py-2">Mean</th>
                <th className="bg-gray-200 px-4 py-2">Slope</th>
              </tr>
            </thead>
            <tbody>
              {calculatedValues && Object.entries(calculatedValues).map(([property, values]) => (
                <tr key={property} className="bg-gray-100">
                  <td className="px-4 py-2">{property}</td>
                  <td className="px-4 py-2">{values.max.toFixed(6)}</td>
                  <td className="px-4 py-2">{values.min.toFixed(6)}</td>
                  <td className="px-4 py-2">{values.mean.toFixed(6)}</td>
                  <td className="px-4 py-2">{values.slope.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChartViewBoundsToggle;
