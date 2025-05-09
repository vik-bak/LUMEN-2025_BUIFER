import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiImage, FiBarChart2 } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const GraphSelector = ({ selectedGraph, onSelectGraph }) => {
  const graphs = ['temperature', 'humidity', 'pressure', 'windSpeed'];

  return (
    <div className="flex justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      {graphs.map((graph) => (
        <button
          key={graph}
          onClick={() => onSelectGraph(graph)}
          className={`px-5 py-2 rounded-full font-medium transition-colors ${
            selectedGraph === graph
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {graph.charAt(0).toUpperCase() + graph.slice(1).replace(/([A-Z])/g, ' $1')}
        </button>
      ))}
    </div>
  );
};

const Header = ({ selectedGraph = 'temperature', onSelectGraph, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('graphs');

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
    onViewChange(view);
    if (view === 'graphs') {
      onSelectGraph('temperature');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg">
      {/* Sidebar with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40">
            {/* Light overlay with reduced opacity */}
            <motion.div
              className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar content */}
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
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentView === 'graphs' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiBarChart2 className="mr-3" />
                    Graphs View
                  </button>
                  <button
                    onClick={() => handleViewChange('photos')}
                    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                      currentView === 'photos'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 font-medium'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <FiImage className="mr-3" />
                    Photos View
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiMenu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Weather Dashboard
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Graph Selector */}
      {currentView === 'graphs' && (
        <GraphSelector 
          selectedGraph={selectedGraph} 
          onSelectGraph={onSelectGraph} 
        />
      )}
    </header>
  );
};

export default Header;