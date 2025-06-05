"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type IconPrototype = {
  _getIconUrl?: () => string;
};

// Fix missing marker icons
// unknown satisfies TypeScript's safety: "We’re not sure what this is yet."
// You then assert it as a type that optionally has _getIconUrl, which makes it valid to delete.
delete (L.Icon.Default.prototype as unknown as IconPrototype)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapClientProps {
  lat: number;
  lng: number;
  label: string;
}

export default function MapClient({ lat, lng, label }: MapClientProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: "200px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  );
}
