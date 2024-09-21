import { Router } from "express";
import * as Activities from "../models/activities.js";


const activityController = Router();

//Get all activities
activityController.get("/", async (req, res) => {
  const activities = await Activities.getAll();

  res.status(200).json({
    status: 200,
    message: "Get all activities",
    activities: activities,
  });
});

//Get activity by ID
activityController.get("/:id",  (req, res) => {
  const activityID = req.params.id;
  
  Activities.getActivityByID(activityID)
    .then((activity) => {
      res.status(200).json({
        status: 200,
        message: "Get activity by ID",
        activity: activity,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get activity by ID",
      });
    });
});

export default activityController;
