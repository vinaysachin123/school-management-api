const { z } = require('zod');
const db = require("../db");
const { calculateDistance } = require('../utils');


const addSchoolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number({ required_error: "Latitude is required", invalid_type_error: "Latitude must be a number" }),
  longitude: z.number({ required_error: "Longitude is required", invalid_type_error: "Longitude must be a number" })
});

const listSchoolsSchema = z.object({
  latitude: z.preprocess((val) => parseFloat(val), z.number().refine(val => !isNaN(val), "Latitude must be a valid number")),
  longitude: z.preprocess((val) => parseFloat(val), z.number().refine(val => !isNaN(val), "Longitude must be a valid number")),
});

exports.addSchool = (req, res) => {
  console.log(req.body);

  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: "All fields required" });
  }

  const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "School added successfully",
      id: result.insertId
    });

  });
};

exports.listSchools = (req, res) => {

  const { latitude, longitude } = req.query;

  const sql = "SELECT * FROM schools";

  db.query(sql, (err, schools) => {

    if (err) return res.status(500).json(err);

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    schools.forEach((school) => {

      const distance = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) +
        Math.pow(userLon - school.longitude, 2)
      );

      school.distance = distance;

    });

    schools.sort((a, b) => a.distance - b.distance);

    res.json(schools);


  });

};
