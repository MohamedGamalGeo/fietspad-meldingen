// LocationImageController.js
const Reports = require('../models/Report')
const SolvedReports = require('../models/SolvedReports')


// save report information 
exports.saveLocationWithImage = async (req, res) => {
    try {
       console.log('Request Body:', req.body);
      console.log('File:', req.file);
    console.log("save location image hits");
    console.log(req.body.option);
    

  
      const { latitude, longitude, description, option} = req.body;
      
      
  
      if (!latitude || !longitude || !description || !option || !req.file) {
        return res.status(400).json({ error: 'All fields and an image are required' });
      }
  
      const report = new Reports({
        latitude,
        longitude,
        description,
        option,
        image: {
          filename: req.file.filename,
          path: req.file.path,
        },
      });
  
      await report.save();
  
      res.status(200).json({
        message: 'Location and image saved successfully!',
        data: report,
      });
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Error saving location and image', details: err.message });
    }
  };
  
// get all locations information 
exports.getAllLocationsWithImages = async (req, res) => {
     console.log("get all location with image hits");
  try {
    const reports = await Reports.find();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching locations', details: err.message });
  }
};

// get all unsolved locations
exports.getAllUnsolvedLocationsWithImages = async (req, res) => {
  // console.log("get unsolved location with image hits");
try {
  const reports = await Reports.find({ status: "unsolved"});
  // console.log(reports)
  res.status(200).json(reports);
} catch (err) {
  res.status(500).json({ error: 'Error fetching locations', details: err.message });
}
};



// Get report about location by id
exports.getSpecificLocation = async (req, res) => {
  try {
    const location = await Reports.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.status(200).json(location);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching location', details: err.message });
  }
}


// soved reports controller
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get the report ID from the route parameters
    const { status } = req.body; // Get the new status from the request body

    if (!['solved', 'unsolved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "solved" or "unsolved".' });
    }

    // Find the report by ID and update its status
    const updatedReport = await Reports.findByIdAndUpdate(
      id,
      { status }, // Update the `status` field
      { new: true } // Return the updated document
    );

    // Handle the case where the report is not found
    if (!updatedReport) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // Respond with the updated report
    res.status(200).json({
      message: `Report status updated to ${status}.`,
      data: updatedReport,
    });
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ error: 'Failed to update report status.' });
  }
};