import { Router } from "express";
import * as Locations from "../models/locations.js";

const locationController = Router();

//Get all locations
locationController.get("/", async (req, res) => {
  const locations = await Locations.getAll();

  res.status(200).json({
    status: 200,
    message: "Get all locations",
    locations: locations,
  });
});

//Get location by Id
locationController.get("/:id", (req, res) => {
  const locationID = req.params.id;

  Locations.getLocationByID(locationID)
    .then((location) => {
      res.status(200).json({
        status: 200,
        message: "Get location by ID",
        location: location,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get location by ID",
      });
    });
});

export default locationController;
