import { useEffect, useRef, useState } from "react";

export default function ListingsMap({ listings, attractions, cityName, cityCenter }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [resolvedListings, setResolvedListings] = useState(null);

  useEffect(() => {
    async function resolveCoords() {
      const withCoords = listings.filter((l) => l.lat && l.lng);
      const withoutCoords = listings.filter((l) => !l.lat || !l.lng);

      if (withoutCoords.length === 0) {
        setResolvedListings(listings);
        return;
      }

      const citiesToGeocode = [
        ...new Set(withoutCoords.map((l) => l.city || cityName)),
      ].filter(Boolean);

      const geocodeResults = {};
      await Promise.all(
        citiesToGeocode.map(async (city) => {
          try {
            const res = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`);
            const data = await res.json();
            if (!data.error) geocodeResults[city] = data;
          } catch (err) {}
        })
      );

      const jittered = withoutCoords.map((item, i) => {
        const cityKey = item.city || cityName;
        const base = geocodeResults[cityKey];
        if (!base) return item;
        const offset = 0.004 * (i + 1);
        return {
          ...item,
          lat: base.lat + (i % 2 === 0 ? offset : -offset),
          lng: base.lng + (i % 3 === 0 ? offset : -offset),
        };
      });

      setResolvedListings([...withCoords, ...jittered]);
    }

    if (listings && listings.length > 0) {
      resolveCoords();
    } else {
      setResolvedListings([]);
    }
  }, [listings, cityName]);

  useEffect(() => {
    if (!mapRef.current || resolvedListings === null) return;

    const plottableListings = resolvedListings.filter((l) => l.lat && l.lng);
    const plottableAttractions = (attractions || []).filter((a) => a.lat && a.lng);

    let center = null;
    if (plottableListings.length > 0) {
      center = [plottableListings[0].lat, plottableListings[0].lng];
    } else if (plottableAttractions.length > 0) {
      center = [plottableAttractions[0].lat, plottableAttractions[0].lng];
    } else if (cityCenter) {
      center = [cityCenter.lat, cityCenter.lng];
    }

    if (!center) return;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current).setView(center, 13);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      const listingIcon = L.divIcon({
        html: `<div style="background:#d9622b;width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [14, 14],
      });

      const attractionIcon = L.divIcon({
        html: `<div style="background:#2b6cd9;width:11px;height:11px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        className: "",
        iconSize: [11, 11],
      });

      plottableListings.forEach((item) => {
        L.marker([item.lat, item.lng], { icon: listingIcon })
          .addTo(map)
          .bindPopup(`<strong>${item.name}</strong><br/>${item.type} · ₹${item.price}`);
      });

      plottableAttractions.forEach((item) => {
        L.marker([item.lat, item.lng], { icon: attractionIcon })
          .addTo(map)
          .bindPopup(`<strong>${item.name}</strong><br/>Attraction`);
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [resolvedListings, attractions, cityCenter]);

  return (
    <div>
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 360,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(60,40,20,0.08)",
        }}
      />
      <div style={{ display: "flex", gap: 18, marginTop: 10, fontSize: 12.5, color: "#777" }}>
        <span><span style={{ color: "#d9622b" }}>●</span> Hotels & stays</span>
        <span><span style={{ color: "#2b6cd9" }}>●</span> Attractions</span>
      </div>
    </div>
  );
}
