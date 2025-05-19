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
                const timeRef = ref(database, `data/${i}/gps_time`);
                const tempRef = ref(database, `data2/${i}/hum`);

                const [timeSnap, tempSnap] = await Promise.all([
                    get(timeRef),
                    get(tempRef),
                ]);

                const timeunix = timeSnap.val();
                const temperature = tempSnap.val();

                if (timeunix !== null && temperature !== null) {
                    results.push({ timeunix, temperature });
                }
            }

            // Sort by the original unix timestamp
            results.sort((a, b) => a.timeunix - b.timeunix);

            // Format the timestamps into readable time
            const formattedResults = results.map(({ timeunix, temperature }) => {
                const date = new Date(timeunix * 1000);
                const time = date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });
                return { time, temperature };
            });

            setTemperatureData(formattedResults);
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval); 

    }, []);

    return temperatureData;
};

export {useTemperatureData, useNewPicture};
