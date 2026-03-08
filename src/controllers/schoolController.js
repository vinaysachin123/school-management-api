const { z } = require('zod');
const db = require('../db');
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

exports.addSchool = async (req, res) => {
    try {
        // Validate request body
        const validatedData = addSchoolSchema.parse(req.body);

        const { name, address, latitude, longitude } = validatedData;

        // Insert into database
        const [result] = await db.pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name, address, latitude, longitude]
        );

        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.listSchools = async (req, res) => {
    try {
        // Validate request query
        const validatedQuery = listSchoolsSchema.parse(req.query);
        const userLat = validatedQuery.latitude;
        const userLon = validatedQuery.longitude;

        // Fetch all schools
        const [schools] = await db.pool.query('SELECT * FROM schools');

        // Calculate distance and sort
        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error('Error listing schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
