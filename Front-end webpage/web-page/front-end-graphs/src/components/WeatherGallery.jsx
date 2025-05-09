// components/WeatherGallery.jsx
import React from 'react';

const WeatherGallery = () => {
  // Sample weather-themed placeholder images
  const weatherPhotos = [
    { id: 1, name: 'Sunny Day.jpg', date: '2023-06-15', size: '2.4 MB' },
    { id: 2, name: 'Cloudy Sky.png', date: '2023-06-18', size: '3.1 MB' },
    { id: 3, name: 'Rainy Afternoon.jpg', date: '2023-06-20', size: '2.8 MB' },
    { id: 4, name: 'Snow Landscape.jpg', date: '2023-01-05', size: '4.2 MB' },
    { id: 5, name: 'Foggy Morning.png', date: '2023-03-12', size: '3.5 MB' },
    { id: 6, name: 'Lightning Storm.jpg', date: '2023-07-22', size: '3.8 MB' },
    { id: 7, name: 'Sunset Clouds.jpg', date: '2023-06-10', size: '2.9 MB' },
    { id: 8, name: 'Rainbow.jpg', date: '2023-05-30', size: '3.2 MB' },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Gallery Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Weather Gallery
          </h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Upload
            </button>
          </div>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {weatherPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-4 flex justify-center items-center h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                <div className="text-4xl">
                  {photo.name.includes('Sunny') ? '☀️' : 
                   photo.name.includes('Cloudy') ? '☁️' :
                   photo.name.includes('Rainy') ? '🌧️' :
                   photo.name.includes('Snow') ? '❄️' :
                   photo.name.includes('Foggy') ? '🌫️' :
                   photo.name.includes('Lightning') ? '⚡' :
                   photo.name.includes('Sunset') ? '🌇' : '🌈'}
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-800 dark:text-white truncate">
                  {photo.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {photo.date} • {photo.size}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* List View Toggle (hidden by default) */}
        <div className="mt-8 hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-gray-600 dark:text-gray-300">Name</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-300">Date</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-300">Size</th>
              </tr>
            </thead>
            <tbody>
              {weatherPhotos.map((photo) => (
                <tr key={photo.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-3 text-gray-800 dark:text-white">{photo.name}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{photo.date}</td>
                  <td className="py-3 text-gray-500 dark:text-gray-400">{photo.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeatherGallery;