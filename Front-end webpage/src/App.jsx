import React, { useState } from 'react';
import Header from './components/Header';
import TemperatureChart from './components/TemperatureChart';
import HumidityChart from './components/HumidityChart';
import PressureChart from './components/PressureChart';
import WindSpeedChart from './components/WindSpeedChart';
import WeatherGallery from './components/WeatherGallery';
//import FirebaseTest from './components/FirebaseTest';
import useTemperatureData from './components/FetchingTempData';


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
    { time: '00:00', pressure: 1013 },
    { time: '01:00', pressure: 1012 },
    { time: '02:00', pressure: 1011 },
    { time: '03:00', pressure: 1010 },
    { time: '04:00', pressure: 1009 },
    { time: '05:00', pressure: 1008 },
  ];

  const windSpeedData = [
    { time: '00:00', windSpeed: 10 },
    { time: '01:00', windSpeed: 12 },
    { time: '02:00', windSpeed: 15 },
    { time: '03:00', windSpeed: 14 },
    { time: '04:00', windSpeed: 13 },
    { time: '05:00', windSpeed: 11 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-800">
      <Header 
        selectedGraph={selectedGraph} 
        onSelectGraph={setSelectedGraph}
        onViewChange={setCurrentView}
      />
      {currentView === 'graphs' ? (
        <div className="container mx-auto p-8">
          {selectedGraph === 'temperature' && (
            <TemperatureChart data={temperatureData} />
          )}
          {selectedGraph === 'humidity' && (
            <HumidityChart data={humidityData} />
          )}
          {selectedGraph === 'pressure' && (
            <PressureChart data={pressureData} />
          )}
          {selectedGraph === 'windSpeed' && (
            <WindSpeedChart data={windSpeedData} />
          )}
        </div>
      ) : (
        <WeatherGallery />
      )}
    </div>
  );
};

export default App;
