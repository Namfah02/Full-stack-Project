import { db } from "../database.js";

export function newClass(
  id, 
  date, 
  time, 
  activity_id, 
  trainer_id, 
  location_id
) {
  return {
    id,
    date,
    time,
    activity_id,
    trainer_id,
    location_id,
  };
}

// Get all classes
export async function getAllClasses() {
  const [allClassesResults] = await db.query("SELECT * FROM classes");

  return await allClassesResults.map((classResult) =>
    newClass(
      classResult.id.toString(),
      classResult.date,
      classResult.time,
      classResult.activity_id,
      classResult.trainer_id,
      classResult.location_id
    )
  );
}

// Get class by trainer ID
export async function getClassByTrainerID(userID) {
  const [classesResults] = await db.query(
    "SELECT * FROM classes WHERE trainer_id = ?",
    userID
  );

  return await classesResults.map((classResult) =>
    newClass(
      classResult.id.toString(),
      classResult.date,
      classResult.time,
      classResult.activity_id,
      classResult.trainer_id,
      classResult.location_id
    )
  );
}

// Get class by class ID
export async function getClassByID(classID) {
  const [classesResults] = await db.query(
    "SELECT * FROM classes WHERE id = ?",
    classID
  );

  if (classesResults.length > 0) {
    const classResult = classesResults[0];
    return Promise.resolve(
      newClass(
        classResult.id.toString(),
        classResult.date,
        classResult.time,
        classResult.activity_id,
        classResult.trainer_id,
        classResult.location_id
      )
    );
  } else {
    return Promise.reject("no results found");
  }
}

// Get class timetable group by date, time and activity
export async function getAllTimetable() {
  const [allClassesResults] =
    await db.query(`SELECT distinct @cnt := @cnt + 1 AS id, classes.date, classes.time, classes.activity_id
      FROM classes
      JOIN activities on activities.id = classes.activity_id
      CROSS JOIN (SELECT @cnt := 0) AS dummy
      GROUP BY date, time, activity_id ORDER BY date`);

  return await allClassesResults.map((classResult) =>
    newClass(
      classResult.id.toString(),
      classResult.date,
      classResult.time,
      classResult.activity_id,
      classResult.trainer_id,
      classResult.location_id
    )
  );
}

// Get all by activity, date and time
export async function getAllByActivityDateTime(activity_id, URLdate, time) {
  const [allClassesResults] = await db.query(
    `SELECT id, date, time, activity_id, trainer_id, location_id
     FROM classes  
     WHERE  activity_id = ? AND date = ? AND time = ?`,
    [activity_id, URLdate, time]
  );

  return await allClassesResults.map((classResult) =>
    newClass(
      classResult.id.toString(),
      classResult.date,
      classResult.time,
      classResult.activity_id,
      classResult.trainer_id,
      classResult.location_id
    )
  );
}

// Create class
export async function create(classTimetable) {
  delete classTimetable.id;

  return db
    .query(
      "INSERT INTO classes (date, time, activity_id, trainer_id, location_id) " +
        "VALUE (?, ?, ?, ?, ?)",
      [
        classTimetable.date,
        classTimetable.time,
        classTimetable.activity_id,
        classTimetable.trainer_id,
        classTimetable.location_id,
      ]
    )
    .then(([result]) => {
      return { ...classTimetable, id: result.insertId };
    });
}

// Update class
export async function update(classTimetable) {
  return db
    .query(
      "UPDATE classes SET date = ?, time = ?, activity_id = ?, trainer_id = ?, location_id = ? WHERE id = ?",
      [
        classTimetable.date,
        classTimetable.time,
        classTimetable.activity_id,
        classTimetable.trainer_id,
        classTimetable.location_id,
        classTimetable.id,
      ]
    )
    .then(([result]) => {
      return { ...classTimetable, id: result.insertId };
    });
}
