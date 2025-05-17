import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 45.8150,  // Zagreb latitude
    lng: 15.9819   // Zagreb longitude
};

const MapComponent = () => {
    return (
        <LoadScript googleMapsApiKey="AIzaSyCsOql7b6BdrGStpetA9FF28e623Tn95kE">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
            >
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
