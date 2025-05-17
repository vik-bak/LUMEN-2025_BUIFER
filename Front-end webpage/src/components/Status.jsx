import React from 'react';
import {
  MdBatteryFull,
  MdBattery50,
  MdBattery20,
  MdWarning,
} from 'react-icons/md';
import { FaHardHat } from 'react-icons/fa';

import { useBatteryStatus, useHitDetected, useHazard } from './useBatteryStatus';
import MapComponent from './MapComponent'; 

const Status = () => {
  const batteryStatus = useBatteryStatus();
  const hitDetected = useHitDetected();
  const hazard = useHazard();

  let Icon = MdBatteryFull;
  let color = 'text-green-600';
  let message = 'Battery OK';

  if (batteryStatus === 2) {
    Icon = MdBattery50;
    color = 'text-yellow-500';
    message = 'Battery Medium';
  } else if (batteryStatus === 3) {
    Icon = MdBattery20;
    color = 'text-red-600';
    message = 'Battery Low';
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Status Overview</h2>

      {/* Hit detected */}
      {hitDetected && (
        <div className="flex items-center gap-3 text-red-600 animate-pulse">
          <FaHardHat size={28} />
          <span className="font-medium">
            Hit Detected at: <time>{new Date().toLocaleString()}</time>
          </span>
        </div>
      )}

      {/* Hazard */}
      {hazard && (
        <div className="flex items-center gap-3 text-purple-600 animate-pulse">
          <MdWarning size={28} />
          <span className="font-medium">HAZARD! Refer to graphs for more info immediately</span>
        </div>
      )}

      {/* Always show Battery status */}
      <div className={`flex items-center gap-3 ${color}`}>
        <Icon size={28} className={batteryStatus === 3 ? 'animate-pulse' : ''} />
        <span className="font-medium">{message}</span>
      </div>
      <h3 className="text-lg mt-6 mb-2 text-gray-800 dark:text-gray-200">Last location acquired (Google Maps)</h3>
      <MapComponent />
    </div>
  );
};

export default Status;
