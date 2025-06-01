import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { deliveryService } from '../../services/deliveryService';

const MapContainer = styled.div`
  height: calc(100vh - 4rem);
  position: relative;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 1;
  max-width: 300px;
`;

const TaskList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TaskItem = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid #E5E7EB;
  cursor: pointer;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #F9FAFB;
  }
  
  ${props => props.active && `
    background-color: #EFF6FF;
  `}
`;

const RouteMap = () => {
  const mapRef = useRef(null);
  const { data: tasks, isLoading } = useQuery(
    'activeTasks',
    () => deliveryService.getActiveTasks()
  );

  useEffect(() => {
    // Initialize map
    const initMap = () => {
      if (!mapRef.current) return;

      // Initialize Google Maps
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 0, lng: 0 },
        zoom: 12,
      });

      // Get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            // Center map on user's location
            map.setCenter(userLocation);

            // Add user marker
            new window.google.maps.Marker({
              position: userLocation,
              map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#3B82F6',
                fillOpacity: 1,
                strokeColor: '#FFFFFF',
                strokeWeight: 2,
              },
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleTaskClick = (task) => {
    // Handle task selection and show route
    console.log('Selected task:', task);
  };

  if (isLoading) return <div>Loading map...</div>;

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      
      <MapOverlay>
        <h3 className="text-lg font-semibold mb-4">Active Tasks</h3>
        <TaskList>
          {tasks?.map(task => (
            <TaskItem
              key={task.id}
              onClick={() => handleTaskClick(task)}
            >
              <div className="font-medium">Order #{task.orderId}</div>
              <div className="text-sm text-gray-500">
                {task.deliveryAddress}
              </div>
              <div className="text-sm text-gray-500">
                Distance: {task.distance} km
              </div>
            </TaskItem>
          ))}
        </TaskList>
      </MapOverlay>
    </MapContainer>
  );
};

export default RouteMap; 