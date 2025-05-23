import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getDatabase, ref, get } from 'firebase/database';

const containerStyle = {
    width: '50%',
    height: '400px',
};

const defaultCenter = {
    lat: 45.800551, // Zagreb latitude
    lng: 15.970911, // Zagreb longitude
};

const MapComponent = () => {
    const [position, setPosition] = useState(defaultCenter);
    const [altitude, setAltitude] = useState(null);

    useEffect(() => {
        const db = getDatabase();

        const fetchGPSData = () => {
            const latRef = ref(db, `data2/1/latitude`);
            const lngRef = ref(db, `data2/1/longitude`);
            const altRef = ref(db, `data2/1/altitude`);

            Promise.all([get(latRef), get(lngRef), get(altRef)])
                .then(([latSnap, lngSnap, altSnap]) => {
                    const lat = parseFloat(latSnap.val());
                    const lng = parseFloat(lngSnap.val());
                    const alt = altSnap.val();

                    // Validate lat/lng values
                    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
                    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;

                    if (isValidLat && isValidLng && lat !== 0 && lng !== 0) {
                        setPosition({ lat, lng });
                    } else {
                        console.warn("Invalid GPS data received:", { lat, lng });
                    }

                    if (alt !== null && alt !== undefined) {
                        setAltitude(alt);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching GPS data:', error);
                });
        };

        fetchGPSData(); // Initial fetch

        const intervalId = setInterval(fetchGPSData, 6000); 

        return () => clearInterval(intervalId); 
    }, []);
console.log("Position:", position);

    return (
        <div className="w-full flex flex-col items-center space-y-2">
            <LoadScript googleMapsApiKey="AIzaSyCsOql7b6BdrGStpetA9FF28e623Tn95kE">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={position}
                    zoom={16}
                >
                    <Marker position={position} />
                </GoogleMap>
            </LoadScript>
            {altitude !== null && (
                <div className="text-sm text-gray-700 dark:text-gray-200">
                    Altitude: {altitude} meters
                </div>
            )}
        </div>
    );
};

export default MapComponent;
