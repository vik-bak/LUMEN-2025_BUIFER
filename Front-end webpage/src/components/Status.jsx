import { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import {
  MdBatteryFull,
  MdBattery50,
  MdBattery20,
  MdWarning,
} from 'react-icons/md';
import { FaHardHat } from 'react-icons/fa';

import { useBatteryStatus, useHitDetected, useHazard, helmetOn, useHighTemp } from './useBatteryStatus';
import MapComponent from './MapComponent';

const Status = () => {
  const batteryStatus = useBatteryStatus();
  const hitDetected = useHitDetected();
  const hazard = useHazard();
  const helmet = helmetOn();
  const highTemp = useHighTemp();

  const [helmetPreviouslyOn, setHelmetPreviouslyOn] = useState(false);
  const [previousHitDetected, setPreviousHitDetected] = useState(false);
  const [showHelmetInfo, setShowHelmetInfo] = useState(true);
  const [showHitInfo, setShowHitInfo] = useState(true);


  const [helmetPutOnTime, setHelmetPutOnTime] = useState(() => {
    const saved = localStorage.getItem('helmetPutOnTime');
    return saved ? new Date(saved) : null;
  });
  const [helmetTakenOffTime, setHelmetTakenOffTime] = useState(() => {
    const saved = localStorage.getItem('helmetTakenOffTime');
    return saved ? new Date(saved) : null;
  });
  const [hitDetectedTime, sethitDetectedTime] = useState(() => {
    const saved = localStorage.getItem('hitDetectedTime');
    return saved ? new Date(saved) : null;
  });
  
  // Reset hit_detected flag once on component mount
  useEffect(() => {
    const db = getDatabase();
    const hitRef = ref(db, 'hit_detected'); // Replace with actual path

    set(hitRef, false)
      .then(() => {
        console.log('Hit detected flag reset successfully.');
      })
      .catch((error) => {
        console.error('Error resetting hit detected flag:', error);
      });
  }, []);

  const resetHitDetectedFlag = () => {
    const db = getDatabase();
    const hitRef = ref(db, 'hit_detected');

    set(hitRef, false)
      .then(() => {
        console.log('Hit detected flag reset.');
        setShowHitInfo(false); // hide message in UI
        localStorage.removeItem('hitDetectedTime'); // optional: clear from localStorage too
      })
      .catch((error) => {
        console.error('Error resetting hit detected flag:', error);
      });
  };


  // Monitor helmet and hit detection state
  useEffect(() => {
    // Helmet tracking
    if (helmet && !helmetPreviouslyOn) {
      setShowHelmetInfo(true);
      const now = new Date();
      setHelmetPutOnTime(now);
      localStorage.setItem('helmetPutOnTime', now.toISOString());
      localStorage.removeItem('helmetTakenOffTime');
      setHelmetPreviouslyOn(true);
    }

    if (!helmet && helmetPreviouslyOn) {
      const now = new Date();
      setHelmetTakenOffTime(now);
      localStorage.setItem('helmetTakenOffTime', now.toISOString());
      setHelmetPreviouslyOn(false);
    }

    // Hit detection change
    if (hitDetected && !previousHitDetected) {
      setShowHitInfo(true);
      const now = new Date();
      sethitDetectedTime(now);
      localStorage.setItem('hitDetectedTime', now.toISOString());
      setPreviousHitDetected(true);
    }

    if (!hitDetected && previousHitDetected) {
      setPreviousHitDetected(false);
    }
  }, [hitDetected, helmet, helmetPreviouslyOn, previousHitDetected]);


  console.log('helmet on:', helmetPutOnTime);
  console.log('HelmetOff:', helmetTakenOffTime);

  const formatDuration = (start, end) => {
    const diffMs = end - start;
    const diffSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSec / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

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
      <div className="flex justify-center w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Status Overview</h2>
      </div>

      {/* Centered messages */}
      <div className="flex flex-col items-center space-y-3">
        {/* Hit detected (always shows if there's a time recorded) */}
        {showHitInfo && hitDetectedTime && (
          <div className={`flex items-center gap-3 text-red-600 ${hitDetected ? 'animate-pulse' : ''}`}>
            <FaHardHat size={28} />
            <span className="font-medium">
              Hit Detected at: <time>{hitDetectedTime.toLocaleString()}</time>
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
        {/* High Temperature */}
        {highTemp && (
          <div className="flex items-center gap-3 text-orange-600 animate-pulse">
            <MdWarning size={28} />
            <span className="font-medium">High temperature detected! Refer to graphs for more info immediately!</span>
          </div>
        )}
        {/* Helmet on/off tracking */}
        {showHelmetInfo && helmetPutOnTime && (
          <div className="flex flex-col items-center text-blue-600">
            <div className="flex flex-row items-center gap-8">
              <div className="flex items-center gap-3">
                <FaHardHat size={28} />
                <span className="font-medium">
                  Helmet put on at: <time>{helmetPutOnTime.toLocaleString()}</time>
                </span>
              </div>

              {showHelmetInfo && helmetTakenOffTime && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <FaHardHat size={20} />
                  <span className="font-medium">
                    Helmet taken down at: <time>{helmetTakenOffTime.toLocaleString()}</time>
                  </span>
                </div>
              )}
            </div>

            {showHelmetInfo && helmetTakenOffTime && (
              <div className="text-sm text-green-600 mt-2">
                Working time: {formatDuration(helmetPutOnTime, helmetTakenOffTime)}
              </div>
            )}
          </div>
        )}

        {/* Battery status */}
        <div className={`flex items-center gap-3 ${color}`}>
          <Icon size={28} className={batteryStatus === 3 ? 'animate-pulse' : ''} />
          <span className="font-medium">{message}</span>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            setShowHitInfo(false);
            localStorage.removeItem('hitDetectedTime');
            sethitDetectedTime(null);
            resetHitDetectedFlag();
          }}
        >
          Clear Hit Info
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            setShowHelmetInfo(false);
            localStorage.removeItem('helmetPutOnTime');
            localStorage.removeItem('helmetTakenOffTime');
            setHelmetPreviouslyOn(false);
            setHelmetTakenOffTime(null);
            setHelmetPutOnTime(null);

          }}
        >
          Clear Helmet Info
        </button>
      </div>

      <div className="flex justify-center w-full">
        <h3 className="text-lg mt-6 mb-2 text-gray-800 dark:text-gray-200">
          Last location acquired (Google Maps)
        </h3>
      </div>
      <div className="flex justify-center w-full">
        <MapComponent />
      </div>
    </div>
  );
};

export default Status;
