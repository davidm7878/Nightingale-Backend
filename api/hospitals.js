import express from "express";
import {
  getAllHospitals,
  getHospitalById,
  getHospitalByName,
  getHospitalsByCity,
  getHospitalsByState,
  createHospital,
  updateHospital,
  deleteHospital,
} from "#db/queries/hospitals";
import { searchHospitalsByCMS, searchHospitalByName } from "#utils/cmsApi";

const router = express.Router();

// Search hospitals from CMS API
router.get("/search", async (req, res, next) => {
  try {
    const { city, state, name, limit } = req.query;

    let results;

    if (name) {
      results = await searchHospitalByName(name, limit ? parseInt(limit) : 10);
    } else if (city || state) {
      results = await searchHospitalsByCMS(
        city,
        state,
        limit ? parseInt(limit) : 100,
      );
    } else {
      return res
        .status(400)
        .json({ error: "Please provide city, state, or name to search" });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Get all hospitals from local database
router.get("/", async (req, res, next) => {
  try {
    const hospitals = await getAllHospitals();
    res.json(hospitals);
  } catch (error) {
    next(error);
  }
});

// Get hospital by ID from local database
router.get("/:id", async (req, res, next) => {
  try {
    const hospital = await getHospitalById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    res.json(hospital);
  } catch (error) {
    next(error);
  }
});

// Create a new hospital
router.post("/", async (req, res, next) => {
  try {
    const { name, street, city, state } = req.body;

    if (!name || !street || !city || !state) {
      return res
        .status(400)
        .json({ error: "Name, street, city, and state are required" });
    }

    const hospital = await createHospital(name, street, city, state);
    res.status(201).json(hospital);
  } catch (error) {
    next(error);
  }
});

// Update a hospital
router.put("/:id", async (req, res, next) => {
  try {
    const { name, street, city, state } = req.body;

    if (!name || !street || !city || !state) {
      return res
        .status(400)
        .json({ error: "Name, street, city, and state are required" });
    }

    const hospital = await updateHospital(
      req.params.id,
      name,
      street,
      city,
      state,
    );

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json(hospital);
  } catch (error) {
    next(error);
  }
});

// Delete a hospital
router.delete("/:id", async (req, res, next) => {
  try {
    const hospital = await deleteHospital(req.params.id);

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.json({ message: "Hospital deleted successfully", hospital });
  } catch (error) {
    next(error);
  }
});

export default router;
