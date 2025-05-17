import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBarChart2, FiSettings, FiCamera } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useTemperatureData, useNewPicture } from './FetchingTempData';
import { useBatteryStatus, useHitDetected, useHazard } from './useBatteryStatus';



const Header = ({ onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('graphs');

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
    onViewChange(view);
  };

  const newPictureAvailable = useNewPicture();
  const batteryStatus = useBatteryStatus();
  const hitDetected = useHitDetected();
  const hazard = useHazard();

  // Determine ping colors for status bar icon
  // Priority: hitDetected/red, batteryStatus red, hazard purple
  let statusPingColor = null;
  if (hitDetected) statusPingColor = 'bg-red-600';
  else if (batteryStatus === 3) statusPingColor = 'bg-red-600';
  else if (hazard) statusPingColor = 'bg-purple-600';

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg">
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40">
            <motion.div
              className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-4 flex justify-end">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                  View Options
                </h3>
                <div className="space-y-3">

                  <button
                    onClick={() => handleViewChange('graphs')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${currentView === 'graphs'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    <FiBarChart2 className="mr-3" />
                    Graphs View
                  </button>

                  <button
                    onClick={() => handleViewChange('status')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${currentView === 'status'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className="relative flex items-center">
                      <FiSettings className="mr-3" size={18} />
                      {/* Ping next to Status Bar tab if any status is true */}
                      {statusPingColor && (
                        <span
                          className={`absolute top-0 right-0 w-3 h-3 rounded-full animate-ping ${statusPingColor}`}
                        />
                      )}
                    </div>
                    Status Bar
                  </button>

                  <button
                    onClick={() => handleViewChange('camera')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${currentView === 'camera'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className="relative flex items-center">
                      <FiCamera className="mr-3" size={18} />
                      {newPictureAvailable && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                      )}
                    </div>
                    Camera
                  </button>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <FiMenu size={24} className="text-gray-600 dark:text-gray-300" />
              </button>

              {/* Ping next to header menu icon */}
              {newPictureAvailable && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
              )}
              {(batteryStatus === 3 || hitDetected) && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              )}
              {hazard && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse" />
              )}
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-red-200 bg-clip-text text-transparent">
              Juggernaut pametna kaciga
            </h1>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};


export default Header;
