import analytics from '@react-native-firebase/analytics';
import mapstyle from '../../data/mapstyle.json';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import throttle from 'lodash.throttle';
import { createMarker } from '../../components/MapReport/ReportMarker';
import markers from '../../data/icons.json';

const MICHIGAN_BLUE = '#00274C';
const MICHIGAN_MAIZE = '#FFCB05';
const BACKEND_URL = 'http://localhost:3000';

const ROUTE_COLORS = {
  CN: '#EE82EE', // new violet
  CS: '#87CEEB', // new sky blue
  CSX: '#FF7F50', // new coral
  MX: '#FFA500', // new orange
  NES: '#FFFF00', // new yellow
  NW: '#32CD32', // new lime green
  WS: '#6A0DAD', // new deep purple
  WX: '#40E0D0', // new turquoise
};

const ROUTE_ID_TO_ROUTE_NAME = {
  CN: 'Commuter North',
  CS: 'Commuter South',
  CSX: 'Commuter South Express',
  MX: 'Med Express',
  NES: 'North-East Shuttle',
  NW: 'Northwood',
  WS: 'Wall Street - NIB',
  WX: 'Wall Street Express',
};

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response received' });
    } else {
      console.error('Error setting up request:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

const Map = () => {
  const mapController = useRef(null);

  const [selectedRouteLines, setSelectedRouteLines] = useState([]);
  const [selectedRouteStops, setSelectedRouteStops] = useState([]);
  const [selectedBuses, setSelectedBuses] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [error, setError] = useState(null);

  const annArbor = {
    latitude: 42.278235,
    longitude: -83.738118,
    latitudeDelta: 0.0222, 
    longitudeDelta: 0.0071, 
  };
  

  const addOneBusRoute = (routeId, subroutes) => {
    let subRouteCtr = 0;
    const routeLines = [];
    const routeStops = [];

    subroutes.forEach((subRoute) => {
      const points = subRoute.pt.map((point) => ({
        latitude: point.lat,
        longitude: point.lon,
      }));

      const routeLine = {
        id: `${routeId}_${subRouteCtr}`,
        points,
        color: ROUTE_COLORS[routeId] || MICHIGAN_BLUE,
        width: 3,
      };

      routeLines.push(routeLine);
      subRouteCtr++;

      subRoute.pt.forEach((point) => {
        if (point.typ === 'S') {
          routeStops.push({
            id: `${routeId}_${point.stpid}_${subRouteCtr}`,
            position: {
              latitude: point.lat,
              longitude: point.lon,
            },
            routeId: routeId,
            name: point.stpnm,
          });
        }
      });

      if (subRoute.dtrpt) {
        const detourPoints = subRoute.dtrpt.map((point) => ({
          latitude: point.lat,
          longitude: point.lon,
        }));

        const detourRouteLine = {
          id: `${routeId}_${subRouteCtr}_detour`,
          points: detourPoints,
          color: ROUTE_COLORS[routeId] || MICHIGAN_BLUE,
          width: 3,
        };

        routeLines.push(detourRouteLine);
        subRouteCtr++;
      }
    });

    return { routeLines, routeStops };
  };

  const getBusRoutes = async () => {
    try {
      const response = await api.get('/route/getAllRoutes');
      if (response) {
        const routeLineJson = response.data.routes;
        const allRouteLines = [];
        const allRouteStops = [];

        for (const routeId in routeLineJson) {
          const { routeLines, routeStops } = addOneBusRoute(routeId, routeLineJson[routeId]);
          allRouteLines.push(...routeLines);
          allRouteStops.push(...routeStops);
        }

        setSelectedRouteLines(allRouteLines);
        setSelectedRouteStops(allRouteStops);
        console.log(`Routes and stops loaded: ${allRouteLines.length} lines, ${allRouteStops.length} stops`);
      }
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      setError('Error fetching bus routes');
    }
  };

  const updateBuses = async () => {
    try {
      const response = await api.get('/bus/getBusPositions');
      if (response) {
        const buses = response.data.buses ?? [];
        const busMarkers = buses.map((bus, index) => ({
          id: `${bus.vid}_${index}`,
          position: {
            latitude: parseFloat(bus.lat),
            longitude: parseFloat(bus.lon),
          },
          rotation: parseFloat(bus.hdg),
          routeId: bus.rt,
        }));

        setSelectedBuses(busMarkers);
        console.log(`Buses updated: ${busMarkers.length} buses`);
      }
    } catch (error) {
      console.error('Error updating buses:', error);
      setError('Error updating buses');
    }
  };

  const handleRegionChangeComplete = throttle((region) => {
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
    setCurrentRegion(region);
    setZoomLevel(zoom);
    console.log(`Zoom level: ${zoom}`);
  }, 300);

  useEffect(() => {
    getBusRoutes();
    const intervalId = setInterval(updateBuses, 7500); // Update every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  const visibleRouteLines = useMemo(() => {
    if (!currentRegion) return selectedRouteLines;

    const bounds = {
      minLat: currentRegion.latitude - currentRegion.latitudeDelta / 2,
      maxLat: currentRegion.latitude + currentRegion.latitudeDelta / 2,
      minLon: currentRegion.longitude - currentRegion.longitudeDelta / 2,
      maxLon: currentRegion.longitude + currentRegion.longitudeDelta / 2,
    };

    return selectedRouteLines.filter((line) =>
      line.points.some(
        (point) =>
          point.latitude >= bounds.minLat &&
          point.latitude <= bounds.maxLat &&
          point.longitude >= bounds.minLon &&
          point.longitude <= bounds.maxLon
      )
    );
  }, [currentRegion, selectedRouteLines]);

  const visibleRouteStops = useMemo(() => {
    if (!currentRegion) return selectedRouteStops;

    const bounds = {
      minLat: currentRegion.latitude - currentRegion.latitudeDelta / 2,
      maxLat: currentRegion.latitude + currentRegion.latitudeDelta / 2,
      minLon: currentRegion.longitude - currentRegion.longitudeDelta / 2,
      maxLon: currentRegion.longitude + currentRegion.longitudeDelta / 2,
    };

    return selectedRouteStops.filter(
      (stop) =>
        stop.position.latitude >= bounds.minLat &&
        stop.position.latitude <= bounds.maxLat &&
        stop.position.longitude >= bounds.minLon &&
        stop.position.longitude <= bounds.maxLon
    );
  }, [currentRegion, selectedRouteStops]);

  return (
    <View style={{ flex: 1 }}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={mapstyle}
        initialRegion={annArbor}
        ref={mapController}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {visibleRouteLines.map((line) => (
          <Polyline
            key={line.id}
            coordinates={line.points}
            strokeColor={line.color}
            strokeWidth={line.width}
          />
        ))}
        {visibleRouteStops.map((stop) => (
          <Marker
            key={stop.id}
            coordinate={stop.position}
            title={stop.name}
            description={`Route: ${ROUTE_ID_TO_ROUTE_NAME[stop.routeId] || stop.routeId}`}
            onPress={() => {
              console.log(`Bus stop clicked: ${stop.name}`);
            }}
          >
            <Image
              source={require('../images/Map/bus-stop.png')}
              style={{ width: 14, height: 14 }} // Adjust the size as needed
            />
          </Marker>
        ))}
        {selectedBuses.map((bus) => (
          <Marker
            key={bus.id}
            coordinate={bus.position}
            rotation={bus.rotation}
          >
            <Image
              source={require('../images/Map/bus.png')}
              style={{ width: 50, height: 50, resizeMode: 'contain' }} // Adjust the size as needed
            />
          </Marker>
        ))}
        {markers.map((marker) =>
          createMarker(
            marker.key,
            marker.coordinate,
            marker.type,
            marker.startTime,
            marker.endTime,
            zoomLevel,
            currentRegion,
            () => alert(`Marker ${marker.key} pressed`)
          )
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Map;