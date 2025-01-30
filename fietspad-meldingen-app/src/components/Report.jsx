import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './SingleReportPage.css'; 

const Report = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await api.get(`/locations/${id}`);
        setLocation(response.data);
        setStatus(response.data.status); // Assuming status is part of the response
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      setIsUpdating(true);

      // Send an API request to update the status
      const updatedStatus = status === 'solved' ? 'unsolved' : 'solved';
      await api.patch(`/locations/${id}/status`, { status: updatedStatus });

      // Update the state after the API call
      setStatus(updatedStatus);
      alert(`Report status updated to ${updatedStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update the report status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!location) {
    return <p>Loading... Please Try Later</p>;
  }

  return (
    <div className="report-details">
      <h1>Report Details</h1>
      <div className="report-card">
        <p><strong>Description:</strong> {location.description}</p>
        <p><strong>Latitude:</strong> {location.latitude}</p>
        <p><strong>Longitude:</strong> {location.longitude}</p>
        <p><strong>Created At:</strong> {new Date(location.createdAt).toLocaleString()}</p>
        <p><strong>Issue Type:</strong> {location.option}</p>
        <p><strong>Status:</strong> {status}</p>
        {location.image?.path ? (
          <img
            src={`http://localhost:2000/${location.image.path}`}
            alt="Location"
            className="location-image"
          />
        ) : (
          <p>No Image</p>
        )}
        <button
          onClick={handleStatusChange}
          disabled={isUpdating}
          className={`status-btn ${status}`}
        >
          Mark as {status === 'solved' ? 'Unsolved' : 'Solved'}
        </button>
      </div>
    </div>
  );
};

export default Report;
