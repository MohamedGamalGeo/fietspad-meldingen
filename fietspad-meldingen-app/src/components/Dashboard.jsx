import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./dashboard.css";
import api from '../api';
import * as XLSX from 'xlsx'; 
import { Bar , Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Link } from 'react-router-dom';
import { getUsernameFromToken } from "../utils/jwtUtils";

const Dashboard = () => {
  const [map, setMap] = useState(null);
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState(null);
  const rowsPerPage = 5;

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
  
  // End of icons

  useEffect(() => {
    // Get JWT token (from local storage, API, or cookies)
    const token = localStorage.getItem("token");

    if (token) {
      const extractedUsername = getUsernameFromToken(token);
      setUsername(extractedUsername);
    }
  }, []);

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
      maxZoom: 20,
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

  const fetchLocations = async (mapInstance) => {
    try {
      const response = await api.get('/'); // Fetch locations from backend
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

  

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentLocations = locations.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(locations.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
 // export data to excel sheet
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(locations);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');
    XLSX.writeFile(workbook, 'locations.xlsx');
  };

  // chart data
// Filter solved and unsolved locations
const solvedLocations = locations.filter(loc => loc.status === 'solved');
const unsolvedLocations = locations.filter(loc => loc.status === 'unsolved');

// Unique issue types
const uniqueIssues = Array.from(new Set(locations.map(loc => loc.option)));

// Count issues by type for solved and unsolved
const countIssuesByStatus = (data, statusLocations) => {
  return uniqueIssues.map(issueType =>
    statusLocations.filter(loc => loc.option === issueType).length
  );
};

const chartData = {
  labels: uniqueIssues,
  datasets: [
    {
      label: 'Solved Issues',
      data: countIssuesByStatus(locations, solvedLocations),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
    {
      label: 'Unsolved Issues',
      data: countIssuesByStatus(locations, unsolvedLocations),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    }
  ]
};

  return (
    
        <div className="centered-container">
            <div><h3>Hello, {username}</h3></div>
          <div id="map"></div>
          <div><h4>Insights About The Report Data</h4></div>
          <div className="chart-section">
                <div className="charts-wrapper">
                     {/* Bar Chart */}
        <div className="chart-container bar-chart">
          <Bar data={chartData} />
        </div>
        
        {/* Pie Chart */}
        <div className="chart-container pie-chart">
          <Pie data={chartData} />
        </div>
                </div>
        </div>
          <button onClick={exportToExcel} className="export-button">Export Data to Excel </button>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Problem</th>
                <th>Report Time</th>
                <th>Image</th>
                <th>Status</th>
                <th>Process this report</th>
              </tr>
            </thead>
            <tbody>
              {currentLocations.map((loc, index) => (
                <tr key={index} className={loc.status === 'solved' ? 'solved-row' : 'unsolved-row'} >
                  <td>{loc.description || 'N/A'}</td>
                  <td>{loc.latitude || 'N/A'}</td>
                  <td>{loc.longitude || 'N/A'}</td>
                  <td>{loc.option || 'N/A'}</td>
                  <td>{loc.createdAt|| 'N/A'}</td>
                  <td>
                    {loc.image?.path ? (
                      <img
                        src={`http://localhost:2000/${loc.image.path}`}
                        alt="Location"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>
                  <td>{loc.status || 'N/A'}</td>
                  <td>{
                    <Link to={`/report/${loc._id}`}>Solve this report</Link>
                    }</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
        </div>
  );
};

export default Dashboard;