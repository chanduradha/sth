
import React, { useState, useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

const ComparePopup = ({ selectedFilesDataArray, onClose, selectedFiles }) => {
    const [selectedVariable, setSelectedVariable] = useState('Tension');
    const [windowSize, setWindowSize] = useState(100); // Initial window size for rolling average
    const plotRef = useRef(null); // Reference to the plot container element

    // Define fileColors array here
    const fileColors = ['blue', 'red' , 'orange', 'yellow']; // Add more colors if needed

    const calculateTickValues = (data, numTicks) => {
        const tickStep = Math.ceil(data.length / numTicks);
        return data.filter((_, index) => index % tickStep === 0);
    };
    
    const calculateTickText = (data, numTicks) => {
        const tickStep = Math.ceil(data.length / numTicks);
        return data.filter((_, index) => index % tickStep === 0).map(time => {
            const [hours, minutes, seconds] = time.split(':');
            return `${hours}:${minutes}:${parseFloat(seconds).toFixed(2)}`;
        });
    };

    useEffect(() => {
        // Extract time and selected variable data for plotting
        const timeData = [];
        const selectedVariableData = [];

        // Split the selectedFilesDataArray string into an array of rows
        const dataArray = selectedFilesDataArray.split('\n').map(row => row.split(';'));

        // Calculate the index of the selected variable
        const selectedVariableIndex = ['Tension', 'Torsion', 'Bending moment X', 'Bending moment Y', 'Temperature'].indexOf(selectedVariable);

        dataArray.forEach((fileData, fileIndex) => {
            if (fileIndex !== 0) { 
                // Skip the first row with column headers
                fileData.forEach((data, index) => {
                    if (index === 4) { // Check if it's the time column
                        // Convert seconds to milliseconds and format the time
                        const fileColor = fileColors[fileIndex % fileColors.length];
                        const seconds = parseFloat(data);
                        if (!isNaN(seconds)) {
                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);
                            const remainingSeconds = seconds % 60;
                            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(2)}`;
                            timeData.push(formattedTime);
                        }
                    } else if (index === selectedVariableIndex) { // Check if it's the selected variable column
                        selectedVariableData.push(parseFloat(data)); // Use the selected variable index
                    }
                });
            }
        });

        // Calculate rolling average
        const rollingAverage = calculateRollingAverage(selectedVariableData, windowSize);
     
        // Calculate tick values
        const tickValues = calculateTickValues(timeData, 15);
        console.log("Tick Values:", tickValues); // Log tick values to console
    
        // Calculate tick text
        const tickText = calculateTickText(timeData, 15);
        console.log("Tick Text:", tickText); // Log tick text to console
  if (plotRef.current) {
    // Prepare data for the Plotly graph
    const plotData = selectedFiles.map((fileName, index) => ({
        x: timeData,
        y: rollingAverage,
        type: 'scatter',
        mode: 'lines',
        marker: { color: fileColors[selectedFiles.indexOf(fileName) % fileColors.length] }, // Use fileColors array
        name: fileName, // Assign name to each trace
    }));

    // Define layout for the Plotly graph
    const layout = {
        width: 1500,
        height: 700,
        title: 'Comparison Plot',
        xaxis: {
            title: 'Time',
            type: 'category', // Use 'category' type for categorical data (time strings)
            tickmode: 'array',
            nticks: 15,
            tickvals: tickValues, // Use calculated tick values
            ticktext: tickText, // Use calculated tick text
        },
        yaxis: {
            title: `${selectedVariable} Rolling Average (Window Size: ${windowSize})`,
            nticks: 20,
        },
    };

    // Render the Plotly line graph
    Plotly.newPlot(plotRef.current, plotData, layout);
}
    }, [selectedVariable, selectedFilesDataArray, windowSize]);


    const handleVariableChange = (variable) => {
        setSelectedVariable(variable);
    };

    const handleWindowSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setWindowSize(newSize);
    };

    // Function to calculate rolling average
    const calculateRollingAverage = (data, windowSize) => {
        const rollingAverage = [];
        for (let i = 0; i < data.length; i++) {
            const startIndex = Math.max(0, i - windowSize + 1);
            const valuesInWindow = data.slice(startIndex, i + 1);
            const average = valuesInWindow.reduce((acc, curr) => acc + curr, 0) / valuesInWindow.length;
            rollingAverage.push(average);
        }
        return rollingAverage;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-lg w-80 h-80" style={{ width: '100%', height: '100%' }}>
                <h2 className="text-lg font-bold mb-4">Comparison Results</h2>
                {/* Render radio buttons for variable selection */}
                <div className="flex space-x-4 mb-4">
                    {['Tension', 'Torsion', 'Bending moment X', 'Bending moment Y', 'Temperature'].map(variable => (
                        <label key={variable} className="inline-flex items-center">
                            <input
                                type="radio"
                                value={variable}
                                checked={selectedVariable === variable}
                                onChange={() => handleVariableChange(variable)}
                                className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2">{variable}</span>
                        </label>
                    ))}
                </div>
                <div ref={plotRef} />
                {/* Input for window size */}
                <div className="mb-4 border border-black border-solid p-4 rounded-lg bg-gray-200" style={{position:'relative', width:'200px',height:'100px',left:'90%',bottom:'35%'}}>
                    <label className="block text-sm font-medium text-gray-700" style={{fontSize:'18px'}}> Average points:</label>
                    <input
                        type="number"
                        value={windowSize}
                        onChange={handleWindowSizeChange}
                        className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        style={{width:'100px',height:'45px'}}
                    />
                </div>
                {/* Container for the Plotly graph */}
                
                <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4">Close</button>
            </div>
            {/* Display selected files in table format */}
            <div className="absolute top-0 right-0 mt-4 mr-4 border border-black border-solid p-4 rounded-lg " style={{height:'220px'}}>
                <table className="border-collapse border border-black border-solid p-4 rounded-lg shadow-lg bg-gray-200" style={{position:'relative',right:'10px'}}>
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">File Name</th>
                            <th className="border border-gray-300 px-4 py-2">Selected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedFiles.map((fileName, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2" style={{ color: fileColors[index % fileColors.length] }}>{fileName}</td>                 
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        readOnly
                                        className="form-checkbox h-5 w-5 text-blue-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparePopup;