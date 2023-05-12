"use client";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    Popup,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/layers-2x.png";
import markerIcon from "leaflet/dist/images/layers.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src,
    iconRetinaUrl: markerIcon2x.src,
    shadowUrl: markerShadow.src,
});

interface MapProps {
    center?: number[];
}

interface LocationProps {
    center: number[] | undefined;
}

const LocationMarker: React.FC<LocationProps> = ({ center }) => {
    const [position, setPosition] = useState(null);
    const map = useMapEvents({
        click() {
            map.locate();
        },
        locationfound(e: L.LocationEvent) {
            // @ts-ignore
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? (
        <Marker position={center as L.LatLngExpression}>
            <Popup>You are here</Popup>
        </Marker>
    ) : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    );
};

const Map: React.FC<MapProps> = ({ center }) => {
    return (
        <MapContainer
            center={(center as L.LatLngExpression) || [51.505, -0.09]}
            zoom={center ? 4 : 2}
            scrollWheelZoom={false}
            className="h-[35vh] rounded-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {
                center && (
                    <LocationMarker center={center} />
                )
            }
        </MapContainer>
    );
};

export default Map;
