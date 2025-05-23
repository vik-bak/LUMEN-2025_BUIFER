import React, { useEffect, useState } from 'react';
import { ref, get, onValue } from 'firebase/database';
import { database } from '../firebase';

const useNewPicture = () => {
    const [newPictureAvailable, setNewPictureAvailable] = useState(false);

    useEffect(() => {
        const newPictureRef = ref(database, 'new_picture');

        const unsubscribe = onValue(newPictureRef, (snapshot) => {
            const value = snapshot.val();
            setNewPictureAvailable(value === true);
        });

        return () => unsubscribe();
    }, []);

    return newPictureAvailable;
};

const useTemperatureData = () => {
    const [temperatureData, setTemperatureData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const results = [];
        
            for (let i = 1; i <= 4; i++) {
                const timeRef = ref(database, `data2/${i}/time`);
                const tempRef = ref(database, `data2/${i}/temp`);
                const [timeSnap, tempSnap] = await Promise.all([
                    get(timeRef),
                    get(tempRef),
                ]);

                const timeStr = timeSnap.val(); // now a string like "13:31:49"
                const temperatureRaw = tempSnap.val();

                if (timeStr !== null && temperatureRaw !== null) {
                    // Convert temperature to real value
                    const temperature = temperatureRaw / 100;
                    results.push({ time: timeStr, temperature });
                }
            }

            // Sort by time string ("HH:MM:SS") lexicographically
            results.sort((a, b) => a.time.localeCompare(b.time));

            setTemperatureData(results);
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return temperatureData;
};


export {useTemperatureData, useNewPicture};
