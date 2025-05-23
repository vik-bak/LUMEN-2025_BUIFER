import React, { useState } from 'react';
import Header from './components/Header';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import PressureChart from './components/PressureChart';
import Status from './components/Status';
import Camera from './components/Camera';
//import FirebaseTest from './components/FirebaseTest';
import { useTemperatureData, useNewPicture } from './components/FetchingTempData';
import { useHumidityData } from './components/FetchingHumData';
import { useGasData } from './components/gasSensorData';
import { useHighTemp } from './components/useBatteryStatus';



const App = () => {
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [currentView, setCurrentView] = useState('graphs'); // 'graphs' or 'gallery'

  const temperatureData = useTemperatureData();
  //console.log('Temperature Data:', temperatureData);

  const humidityData = useHumidityData();

  const pressureData = useGasData();
  const highTemp = useHighTemp();
  //console.log('Humidity Data:', pressureData);

  <Header onViewChange={setCurrentView} />

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-800">
      <Header
        selectedGraph={selectedGraph}
        onSelectGraph={setSelectedGraph}
        onViewChange={setCurrentView}
      />
      {currentView === 'graphs' && (
        <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`bg-white dark:bg-gray-900 p-4 rounded-xl shadow ${highTemp ? 'border-4 border-red-600 animate-pulse' : ''
              }`}
          >
            <TemperatureChart data={temperatureData} />
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <HumidityChart data={humidityData} />
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
            <PressureChart data={pressureData} />
          </div>
        </div>
      )}
      {currentView === 'status' && <Status />}

      {currentView === 'camera' && (<div className="container mx-auto p-8">
        <Camera />
      </div>)}

    </div>
  );
};

export default App;
