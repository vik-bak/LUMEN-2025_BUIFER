import React, { useEffect, useState, useRef } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import { getDatabase, ref as dbRef, set } from "firebase/database";

const Camera = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const hasResetFlag = useRef(false); // track if flag was reset

    useEffect(() => {
        let intervalId;

        const fetchImage = async () => {
            try {
                const imageRef = ref(storage, '/data/photo.jpg');
                const url = await getDownloadURL(imageRef);
                // Add a timestamp to force refresh
                setImageUrl(`${url}?t=${Date.now()}`);
                setLoading(false);

                if(!hasResetFlag.current) {
                    set(dbRef(getDatabase(), 'new_picture'), false);
                    hasResetFlag.current = true; // set flag to true after first reset
                }
            } catch (error) {
                console.error('Error loading image:', error);
                setLoading(false);
            }
        };

        // Fetch every second
        fetchImage(); // Initial fetch
        intervalId = setInterval(fetchImage, 1000);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Latest taken picture from the Camera
            </h2>
            {loading ? (
                <p className="text-gray-500 dark:text-gray-300">Loading image...</p>
            ) : imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Camera snapshot"
                    width={640}
                    height={480}
                    className="mx-auto rounded shadow"
                />
            ) : (
                <p className="text-red-500">Image not found.</p>
            )}
        </div>
    );
};

export default Camera;
