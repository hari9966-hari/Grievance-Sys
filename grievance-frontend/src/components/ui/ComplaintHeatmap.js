import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { adminAPI } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const ComplaintHeatmap = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminAPI.getHeatmapData();
        if (response.data.success) {
          setData(response.data.heatmapData);
        }
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMarkerColor = (intensity) => {
    if (intensity >= 1.0) return '#ef4444'; // Critical
    if (intensity >= 0.7) return '#f59e0b'; // High
    if (intensity >= 0.4) return '#3b82f6'; // Medium
    return '#10b981'; // Low
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl h-[400px] flex items-center justify-center border border-neutral-100 shadow-soft">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Calculate center based on data points, fallback to Chennai
  const getCenter = () => {
    if (data && data.length > 0) {
      const avgLat = data.reduce((sum, p) => sum + p.lat, 0) / data.length;
      const avgLng = data.reduce((sum, p) => sum + p.lng, 0) / data.length;
      return [avgLat, avgLng];
    }
    return [13.0827, 80.2707]; // Chennai default
  };

  const center = getCenter();

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-neutral-100 overflow-hidden">
      <div className="p-4 border-b border-neutral-50 bg-neutral-50/50">
        <h2 className="text-lg font-bold text-neutral-900">
          {language === 'en' ? 'Complaint Hotspots' : 'புகார் மையங்கள்'}
        </h2>
        <p className="text-xs text-neutral-500">
          {language === 'en' ? 'Visualizing geographical distribution of active issues.' : 'செயலில் உள்ள சிக்கல்களின் புவியியல் பரவலை காட்சிப்படுத்துதல்.'}
        </p>
      </div>
      
      <div className="h-[400px] w-full z-0">
        <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
          <RecenterMap center={center} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {data.map((point) => (
            <CircleMarker
              key={point._id}
              center={[point.lat, point.lng]}
              radius={8 + point.intensity * 10}
              fillColor={getMarkerColor(point.intensity)}
              color="white"
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-bold text-neutral-900 text-sm">{point.title}</h4>
                  <p className="text-xs text-neutral-600 mt-1">{point.location}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      <div className="p-4 bg-white flex items-center gap-6 justify-center border-t border-neutral-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-danger-500"></div>
          <span className="text-xs font-semibold text-neutral-600">{language === 'en' ? 'Critical' : 'மிகவும் முக்கியமானது'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning-500"></div>
          <span className="text-xs font-semibold text-neutral-600">{language === 'en' ? 'High' : 'முக்கியமானது'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          <span className="text-xs font-semibold text-neutral-600">{language === 'en' ? 'Medium' : 'சாதாரண'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success-500"></div>
          <span className="text-xs font-semibold text-neutral-600">{language === 'en' ? 'Low' : 'குறைந்தது'}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintHeatmap;
