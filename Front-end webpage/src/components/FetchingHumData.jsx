import React, { useEffect, useState } from 'react';
import { ref, get, onValue } from 'firebase/database';
import { database } from '../firebase';


const useHumidityData = () => {
    const [humidityData, setHumidityData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const humResults = [];

            for (let i = 1; i <= 4; i++) {
                const timeRef = ref(database, `data2/${i}/time`);
                const humRef = ref(database, `data2/${i}/hum`);

                const [timeSnap, humSnap] = await Promise.all([
                    get(timeRef),
                    get(humRef),
                ]);

                const timeStr = timeSnap.val(); // now a string like "13:31:49"
                const humidity = humSnap.val();

                if (timeStr !== null && humidity !== null) {
                    humResults.push({ time: timeStr, humidity });
                }
            }
            humResults.sort((a, b) => a.time.localeCompare(b.time));

            setHumidityData(humResults);
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return humidityData;
};


export { useHumidityData };
