 const Image = require('../models/imageModel');

// exports.uploadImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded.' });
//     }

//     // Construct the public path for the uploaded file
//     const filePath = `/uploads/${req.file.filename}`;
//     console.log(filePath);
    
    
    

//     // Save the image metadata to the database
//     const image = new Image({
//       filename: req.file.filename,
//       path: filePath,
//     });
//     await image.save();
    

//     res.status(200).json({
      
//       message: 'Image uploaded successfully!',
//       image: {
//         id: image._id,
//         filename: image.filename,
//         path: filePath, // Publicly accessible URL
//       },
//     });
//   } catch (err) {
//     console.error('Error uploading image:', err);
//     res.status(500).json({ error: `Error uploading image: ${err.message}` });
//   }

// };



// Image Upload Controller
exports.uploadImage = async (req, res) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
    });

    await image.save(); // Save image metadata to the database

    res.status(200).json({
      message: 'Image uploaded successfully!',
      image: {
        id: image._id,
        filename: image.filename,
        path: image.path,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading image' });
  }
};
