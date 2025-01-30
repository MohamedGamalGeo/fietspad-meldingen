
// routes/locationImageRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const LocationImageController = require('../controllers/LocationImageController');
const Reports= require('../models/Report');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post(
  '/save',
  upload.single('image'),
  LocationImageController.saveLocationWithImage
);

// router.post(
//   '/solve',
//   upload.single('image'),
//   LocationImageController.solvedReports
// );

// Route to update report status
router.patch('/locations/:id/status', LocationImageController.updateReportStatus);


router.get('/', LocationImageController.getAllLocationsWithImages);

// Route to get a specific location by ID
router.get('/locations/:id', LocationImageController.getSpecificLocation)

// Route to get all unsolved locations

router.get('/unsolved', LocationImageController.getAllUnsolvedLocationsWithImages);

module.exports = router;
