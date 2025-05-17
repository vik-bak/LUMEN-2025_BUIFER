// hooks/useBatteryStatus.js
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { database } from '../firebase';

const useBatteryStatus = () => {
    const [status, setStatus] = useState(0); // 0 = OK, 2 = Medium, 3 = Low

    useEffect(() => {
        const db = getDatabase();
        const batteryRef = ref(db, 'bat_status');

        const unsubscribe = onValue(batteryRef, (snapshot) => {
            const value = snapshot.val();
            if (typeof value === 'number') {
                setStatus(value);
            }
        });

        return () => unsubscribe();
    }, []);

    return status;
};

const useHitDetected = () => {
    const [newHitDetected, setnewHitDetected] = useState(false);

    useEffect(() => {
        const newHitRef = ref(database, 'hit_detected');

        const unsubscribe = onValue(newHitRef, (snapshot) => {
            const value = snapshot.val();
            setnewHitDetected(value === true);
        });

        return () => unsubscribe();
    }, []);

    return newHitDetected;
};

const useHazard = () => {
    const [hazard, setHazard] = useState(false);

    useEffect(() => {
        const hazardRef = ref(database, 'hazard');

        const unsubscribe = onValue(hazardRef, (snapshot) => {
            const value = snapshot.val();
            setHazard(value === true);
        });

        return () => unsubscribe();
    }, []);

    return hazard;
};

export { useBatteryStatus, useHitDetected, useHazard };