import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./MapComponent.css";
import api from '../api';
import { getUsernameFromToken } from "../utils/jwtUtils";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [description, setDescription] = useState('');
  const [option, setOption] = useState('');
  const [image, setImage] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [username, setUsername] = useState(null);

  // const warningIcon = new L.Icon({
  //   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  //   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [0, -40],
  // });

  // My custom Icons
  const icons = {
    Potholes: new L.Icon({
      iconUrl: '/icons/potholes-icon.png', // Correct URL based on public folder
      iconSize: [40, 40], // Adjust size as needed
    }),
    "Slippery surfaces": new L.Icon({
      iconUrl: '/icons/slippery-icon.png',
      iconSize: [40, 40],
    }),
    "Poor lighting": new L.Icon({
      iconUrl: '/icons/poor-lighting-icon.png',
      iconSize: [40, 40],
    }),
    "Blocked routes": new L.Icon({
      iconUrl: '/icons/blocked-routes-icon.png',
      iconSize: [40, 40],
    }),
    Other: new L.Icon({
      iconUrl: '/icons/other-icon.png',
      iconSize: [40, 40],
    }),
    default: new L.Icon({
      iconUrl: '/icons/default-icon.png',
      iconSize: [40, 40],
    }),
  };
  

  // End of icogit commit -m "Initial commit for mapping-dashboard branch"

  useEffect(() => {
    // Get JWT token (from local storage, API, or cookies)
    const token = localStorage.getItem("token");

    if (token) {
      const extractedUsername = getUsernameFromToken(token);

      setUsername(extractedUsername);
      console.log(username);
      
    }
  }, [username]);





  useEffect(() => {
        const initializedMap = L.map('map').setView([52.1326, 4.2913], 9);

    // Base Layer 1: OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    });
    
    // Base Layer 2: Satellite
    const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
});

     const  googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
  });
      
    // WMS Layer: Cycleway in Den Hag
    const cyclewayLayer = L.tileLayer.wms('http://localhost:8080/geoserver/Cycling/wms', {
      layers: 'Cycling:routes_shape',  // Replace with the WMS layer name
      format: 'image/png',
      transparent: true,
      attribution: 'Cycleway Infrastructure in Den Haag',
    });
    
    //the default layer OSM to the map
    osmLayer.addTo(initializedMap);
    
    // Layer Control
    const baseLayers = {
      "OpenStreetMap": osmLayer,
      "Google Satellite": googleSat,
    };
    
    const overlayLayers = {
      "Cycleway Den Haag": cyclewayLayer,
      "Google Street":googleStreets,
    };

    
    // Add the Layer Control to the map
    L.control.layers(baseLayers, overlayLayers).addTo(initializedMap);
    
    // Set the map state
    setMap(initializedMap);

    

    // Fetch saved locations from the database and add it to the Map
    fetchLocations(initializedMap);

    // Popup WMS
    initializedMap.on('click', function (e) {
      const wmsUrl = 'http://localhost:8080/geoserver/Cycling/wms';
      const params = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        layers: 'Cycling:routes_shape',
        query_layers: 'Cycling:routes_shape',
        info_format: 'application/json',
        bbox: initializedMap.getBounds().toBBoxString(),
        width: initializedMap.getSize().x,
        height: initializedMap.getSize().y,
        x: Math.round(initializedMap.latLngToContainerPoint(e.latlng).x),
        y: Math.round(initializedMap.latLngToContainerPoint(e.latlng).y)
      };
    
      const queryUrl = `${wmsUrl}?${new URLSearchParams(params).toString()}`;
    
      fetch(queryUrl)
        .then(response => response.json())
        .then(data => {
          // console.log(data);  // Log the response for debugging
          if (data.features && data.features.length > 0) {
            const properties = data.features[0].properties;
            const content = `
        <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
          <tr>
            <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Attribute</th>
            <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Value</th>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Name</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${properties.name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Type</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${properties.type || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Oneway</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${properties.oneway || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Bridge</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${properties.bridge || 'N/A'}</td>
          </tr>
          <tr>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Maxspeed</strong></td>
            <td style="border-bottom: 1px solid #ddd; padding: 8px;">${properties.maxspeed || 'N/A'}</td>
          </tr>
      </table>
        `;
    
            L.popup()
              .setLatLng(e.latlng)
              .setContent(content)
              .openOn(initializedMap);
          } else {
            L.popup()
              .setLatLng(e.latlng)
              .setContent('No feature information found.')
              .openOn(initializedMap);
          }
        })
        .catch(error => {
          console.error('Error fetching feature info:', error);
          L.popup()
            .setLatLng(e.latlng)
            .setContent('Error fetching feature information.')
            .openOn(initializedMap);
        });
    });
//popup end    

    return () => {
      initializedMap.remove();
    };
  }, []);

  
  // my old fetchLocation func without Icons 
  // const fetchLocations = async (mapInstance) => {
  //   try {
  //     const response = await api.get('/locations');
  //     const savedLocations = response.data;
  //     setLocations(savedLocations);
  //     savedLocations.forEach((loc) => {
  //       const marker = L.marker([loc.latitude, loc.longitude], { icon: warningIcon })
  //         .addTo(mapInstance)
  //         .bindPopup(
            
  //           `
  //           <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  //   <tr>
  //     <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Field</th>
  //     <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Value</th>
  //   </tr>
  //   <tr>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Description</strong></td>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.description || 'N/A'}</td>
  //   </tr>
  //    <tr>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Latitude</strong></td>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.latitude || 'N/A'}</td>
  //   </tr>
  //    <tr>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Longitude</strong></td>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.longitude || 'N/A'}</td>
  //   </tr>
  //   <tr>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Route Problem</strong></td>
  //     <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.option || 'N/A'}</td>
  //   </tr>
  //   <tr>
  //     <td colspan="2" style="padding: 8px; text-align: center;">
  //       <img src="http://localhost:5000/${loc.image?.path}" 
  //            alt="Location Image" 
  //            style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 4px;" />
  //     </td>
  //   </tr>
  // </table>
  //           `
  //         );
  //       setMarkers((prevMarkers) => [...prevMarkers, marker]);
  //     });      
  //   } catch (error) {
  //     console.error('Error fetching locations:', error);
  //   }
  // };
    

  const fetchLocations = async (mapInstance) => {
    try {
      const response = await api.get('/unsolved'); // Fetch locations from backend
      //const response = await fetch('http://localhost:5000/api/locations'); // Replace with your actual API URL
      const savedLocations = response.data;
      setLocations(savedLocations);
  
      // Iterate through saved locations
      savedLocations.forEach((loc) => {
        // Select appropriate icon based on reported problem
        const problemIcon = icons[loc.option] || icons.default;
  
        // Create and add a marker to the map
        const marker = L.marker([loc.latitude, loc.longitude], { icon: problemIcon })
          .addTo(mapInstance)
          .bindPopup(
            `
            <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
              <tr>
                <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Field</th>
                <th style="text-align: left; border-bottom: 2px solid #ddd; padding: 8px;">Value</th>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Description</strong></td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.description || 'N/A'}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Latitude</strong></td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.latitude || 'N/A'}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Longitude</strong></td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.longitude || 'N/A'}</td>
              </tr>
              <tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Route Problem</strong></td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.option || 'N/A'}</td>
              </tr>
              </tr><tr>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;"><strong>Report Time</strong></td>
                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${loc.createdAt|| 'N/A'}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: center;">
                  <img src="http://localhost:2000/${loc.image?.path}" 
                       alt="Location Image" 
                       style="width: 200px; height: 200px; border: 1px solid #ddd; border-radius: 4px;" />
                </td>
              </tr>
            </table>
            `
          );
  
        // Save marker to state
        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      });
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };
  

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          const marker = L.marker([latitude, longitude]).addTo(map).bindPopup('Your Location');
          map.setView([latitude, longitude], 19);
          setMarkers((prevMarkers) => [...prevMarkers, marker]);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(` this is front end${option}`);
    

    if (!description || !image || !option) {
      return alert('All fields are required.');
    }

    const formData = new FormData();
    const { lat, lng } = map.getCenter();
    formData.append('latitude', lat);
    formData.append('longitude', lng);
    formData.append('description', description);
    formData.append('option', option )
    formData.append('image', image);

    try {
      const response = await api.post('/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Location and image saved successfully!');
      setDescription('');
      setOption('');
      setImage(null);
      fetchLocations(map);
    } catch (error) {
      console.error('Error saving location and image:', error);
      alert('Failed to save location and image.');
    }
  };

  return (
    <div className='centered-container'>
      <div><h3>Hello, {username} </h3></div>
      <div id="map" ></div>
      <button onClick={getUserLocation}>Locate Me</button>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Provide a description of the location"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <select  value={option} onChange={(e) => setOption(e.target.value)} >  
            <option> Select an issue to report:   </option>  
            <option value="Potholes"> Potholes </option>  
            <option value="Slippery surfaces" > Slippery surfaces  </option>  
            <option value="Poor lighting"> Poor lighting </option>  
            <option value="Blocked routes"> Blocked routes </option>  
            <option value="Other"> Recommendations or other Enhancements </option>  
        </select>  
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Save Location</button>
      </form>
    </div>
  );
};

export default MapComponent;
