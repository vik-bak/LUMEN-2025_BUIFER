import React, { useState } from 'react';
import Header from './components/Header';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import PressureChart from './components/PressureChart';
import Status from './components/Status';
import Camera from './components/Camera';
//import FirebaseTest from './components/FirebaseTest';
import { useTemperatureData, useNewPicture } from './components/FetchingTempData';


const App = () => {
  const [selectedGraph, setSelectedGraph] = useState('temperature');
  const [currentView, setCurrentView] = useState('graphs'); // 'graphs' or 'gallery'

  const temperatureData = useTemperatureData();
  //console.log('Temperature Data:', temperatureData);

  const humidityData = [
    { time: '00:00', humidity: 45 },
    { time: '01:00', humidity: 50 },
    { time: '02:00', humidity: 55 },
    { time: '03:00', humidity: 60 },
    { time: '04:00', humidity: 65 },
    { time: '05:00', humidity: 70 },
  ];

  const pressureData = [
    { time: '00:00', pressureSensor1: 1013, pressureSensor2: 1000, pressureSensor3: 1020 },
    { time: '01:00', pressureSensor1: 1012, pressureSensor2: 1015, pressureSensor3: 1034 },
    { time: '02:00', pressureSensor1: 1013, pressureSensor2: 1033, pressureSensor3: 1043 },
    { time: '03:00', pressureSensor1: 1014, pressureSensor2: 1023, pressureSensor3: 1073 },
    { time: '04:00', pressureSensor1: 1012, pressureSensor2: 1018, pressureSensor3: 1033 },
    { time: '05:00', pressureSensor1: 1000, pressureSensor2: 1015, pressureSensor3: 1003 },
  ];

  const windSpeedData = [
    { time: '00:00', windSpeed: 10 },
    { time: '01:00', windSpeed: 12 },
    { time: '02:00', windSpeed: 15 },
    { time: '03:00', windSpeed: 14 },
    { time: '04:00', windSpeed: 13 },
    { time: '05:00', windSpeed: 11 },
  ];
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
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
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
