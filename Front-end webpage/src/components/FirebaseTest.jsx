import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

const FirebaseTest = () => {
    const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
        const imageRef = ref(database, 'test/image');

        const unsubscribe = onValue(imageRef, (snapshot) => {
            const value = snapshot.val();
            setImagePath(value);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white p-4 rounded shadow mt-4">
            <h2 className="text-xl font-bold mb-2">Firebase Test</h2>
            {imagePath ? (
                <p>Value from Firebase: <strong>{imagePath}</strong></p>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default FirebaseTest;
