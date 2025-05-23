import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

const useGasData = () => {
    const [gasData, setGasData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const gasResults = [];

            for (let i = 1; i <= 4; i++) {
                const timeRef = ref(database, `data2/${i}/time`);
                const coRef = ref(database, `data2/${i}/co`);
                const smokeRef = ref(database, `data2/${i}/smoke`);
                const lpgRef = ref(database, `data2/${i}/lpg`);

                const [timeSnap, coSnap, smokeSnap, lpgSnap] = await Promise.all([
                    get(timeRef),
                    get(coRef),
                    get(smokeRef),
                    get(lpgRef),
                ]);

                const timeStr = timeSnap.val();
                const co = coSnap.val();
                const smoke = smokeSnap.val();
                const lpg = lpgSnap.val();

                if (timeStr !== null && co !== null && smoke !== null && lpg !== null) {
                    gasResults.push({
                        time: timeStr,
                        CO: co,
                        Smoke: smoke,
                        LPG: lpg,
                    });
                }
            }

            gasResults.sort((a, b) => a.time.localeCompare(b.time));
            setGasData(gasResults);
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);

        return () => clearInterval(interval);
    }, []);

    return gasData;
};

export { useGasData };
