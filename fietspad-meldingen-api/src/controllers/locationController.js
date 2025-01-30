const Location = require('../models/Location');

// for image 
const multer = require('multer');
const Image = require('../models/imageModel');
// old one 

exports.saveLocation = async (req, res) => {
  console.log("save location");
  const { latitude, longitude, description } = req.body;
  
    if (!latitude || !longitude || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const location = new Location({ latitude, longitude, description });
      await location.save();
      res.status(200).json({ message: 'Location saved successfully!' });
    } catch (err) {
      res.status(500).json({ error: 'Error saving location' });
    }
 
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations', error: error.message });
  }
};




// router.post('/', async (req, res) => {
//     const { latitude, longitude, description } = req.body;
  
//     if (!latitude || !longitude || !description) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
  
//     try {
//       const location = new Location({ latitude, longitude, description });
//       await location.save();
//       res.status(200).json({ message: 'Location saved successfully!' });
//     } catch (err) {
//       res.status(500).json({ error: 'Error saving location' });
//     }
//   });
  
//   // Get all locations
//   router.get('/', async (req, res) => {
//     try {
//       const locations = await Location.find();
//       res.status(200).json(locations);
//     } catch (err) {
//       res.status(500).json({ error: 'Error fetching locations' });
//     }
//   });