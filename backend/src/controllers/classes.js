import { Router } from "express";
import * as Classes from "../models/classes.js";
import auth from "../middleware/auth.js";
import xml2js from "xml2js";
import * as Users from "../models/users.js";
import * as Location from "../models/locations.js";
import * as Activity from "../models/activities.js";

const classController = Router();

//Create class
classController.post("/", auth(["manager", "trainer"]), (req, res) => {
  // Get the class data out of the request
  const classData = req.body;
  const idRegex = /^\d+$/;

  // Implement request validation
  if (!/^\d{4}-\d{2}-\d{2}$/.test(classData.date)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid date format",
    });
  }
  if (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(classData.time)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid time format",
    });
  }

  if (
    !idRegex.test(classData.activity_id) ||
    !idRegex.test(classData.trainer_id) ||
    !idRegex.test(classData.location_id)
  ) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  // Convert the class data into an class model object
  const classTimetable = Classes.newClass(
    null,
    classData.date,
    classData.time,
    classData.activity_id,
    classData.trainer_id,
    classData.location_id
  );

  // Use the create model function to insert this class into the database
  Classes.create(classTimetable)
    .then((classTimetable) => {
      res.status(200).json({
        status: 200,
        message: "Created class successfully",
        classTimetable: classTimetable,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to created class",
      });
    });
});

//Get all timetable to display on timetable page
classController.get("/", async (req, res) => {
  const classes = await Classes.getAllTimetable();
  res.status(200).json({
    status: 200,
    message: "Get all timetable",
    classes: classes,
  });
});

// Get all classes for manager and trainer on import lists page
classController.get("/allclasses", async (req, res) => {
  const classes = await Classes.getAllClasses();
  res.status(200).json({
    status: 200,
    message: "Get all classes",
    classes: classes,
  });
});

//Get classes for create booking
classController.get("/:activity_id/:URLdate/:time", async (req, res) => {
  const { activity_id, URLdate, time } = req.params;
  const classes = await Classes.getAllByActivityDateTime(
    activity_id,
    URLdate,
    time
  );

  res.status(200).json({
    status: 200,
    message: "Get all extend classes ",
    classes: classes,
  });
});

//Get class by ID
classController.get("/:id", (req, res) => {
  const classID = req.params.id;

  Classes.getClassByID(classID)
    .then((classTimetable) => {
      res.status(200).json({
        status: 200,
        message: "Get class by ID",
        classTimetable: classTimetable,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get class by ID",
      });
    });
});

//Get class by trainer ID
classController.get("/trainer/:id", (req, res) => {
  const userID = req.params.id;

  Classes.getClassByTrainerID(userID)
    .then((classTimetable) => {
      res.status(200).json({
        status: 200,
        message: "Get class by trainer ID",
        classTimetable: classTimetable,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get class by ID",
      });
    });
});

//update class
classController.patch("/:id", auth(["manager", "trainer"]), (req, res) => {
  const classID = req.params.id;
  const classData = req.body;
  classData.id = classID;

  // Implement request validation
  const idRegex = /^\d+$/;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(classData.date)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid date format",
    });
  }
  if (!/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(classData.time)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid time format",
    });
  }

  if (
    !idRegex.test(classData.id) ||
    !idRegex.test(classData.activity_id) ||
    !idRegex.test(classData.trainer_id) ||
    !idRegex.test(classData.location_id)
  ) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  const classTimetable = Classes.newClass(
    classData.id,
    classData.date,
    classData.time,
    classData.activity_id,
    classData.trainer_id,
    classData.location_id
  );

  Classes.update(classTimetable)
    .then((result) => {
      res.status(200).json({
        status: 200,
        message: "Class updated",
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to update class",
      });
    });
});

// XML upload
classController.post(
  "/upload-xml",
  auth(["manager", "trainer"]),
  (req, res) => {
    if (req.files && req.files["xml-file"]) {
      // Access the XML file as a string
      const XMLFile = req.files["xml-file"];
      const file_text = XMLFile.data.toString();

      // Set up XML parser
      const parser = new xml2js.Parser();
      parser
        .parseStringPromise(file_text)
        .then((data) => {
          const classUpload = data["class-upload"];
          const classUploadAttributes = classUpload["$"];
          const operation = classUploadAttributes["operation"];
          //Indexing to reach nested children
          const classesData = classUpload["classes"][0]["class"];

          if (operation == "insert") {
            Promise.all(
              classesData.map(async (classData) => {
                const activity = classData.activity[0];
                const activityClass = await Activity.getByName(activity);
                const trainer = classData.trainer[0];
                const trainerClass = await Users.getByName( trainer.split(" ")[0],trainer.split(" ")[1]);
                const location = classData.location[0];
                const locationClass = await Location.getByName(location);

                // Convert the xml object into a model object
                const classModel = Classes.newClass(
                  null,
                  classData.date.toString(),
                  classData.time.toString(),
                  activityClass.id,
                  trainerClass.id,
                  locationClass.id
                );
                // Return the promise of each creation query
                return Classes.create(classModel);
              })
            )
              .then((results) => {
                res.status(200).json({
                  status: 200,
                  message: "XML Upload insert successful",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status: 500,
                  message: "XML upload failed on database operation: " + error,
                });
              });
          } else if (operation == "update") {
            Promise.all(
              classesData.map(async (classData) => {
                const trainer = classData.trainer[0];
                const trainerClass = await Users.getByName( trainer.split(" ")[0], trainer.split(" ")[1]);
                const activity = classData.activity[0];
                const activityClass = await Activity.getByName(activity);
                const location = classData.location[0];
                const locationClass = await Location.getByName(location);
                
                // Convert the xml object into a model object
                const classModel = Classes.newClass(
                  classData.id.toString(),
                  classData.date.toString(),
                  classData.time.toString(),
                  activityClass.id,
                  trainerClass.id,
                  locationClass.id
                );
                // Return the promise of each creation query
                return Classes.update(classModel);
              })
            )
              .then((results) => {
                res.status(200).json({
                  status: 200,
                  message: "XML Upload update successful",
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status: 500,
                  message: "XML upload failed on database operation: " + error,
                });
              });
          } else {
            res.status(400).json({
              status: 400,
              message: "XML Contains invalid operation attribute value",
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status: 500,
            message: "Error parsing XML - " + error,
          });
        });
    } else {
      res.status(400).json({
        status: 400,
        message: "No file selected",
      });
    }
  }
);

export default classController;
