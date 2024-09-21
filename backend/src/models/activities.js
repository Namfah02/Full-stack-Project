import { db } from "../database.js"

export function newActivity (
    id,
    name,
    description,
    duration
) {
    return {
        id,
        name,
        description,
        duration
    }
}

// Get all activities
export async function getAll() {
    const [allActivitiesResults] = await db.query("SELECT * FROM activities")

    return await allActivitiesResults.map((activityResult) =>
        newActivity(
            activityResult.id.toString(),
            activityResult.name,
            activityResult.description,
            activityResult.duration,
        ))
}

// Get activity by activity ID
export async function getActivityByID(activityId) {
    const [activitiesResults] = await db.query("SELECT * FROM activities WHERE id = ?", activityId)
  
    if (activitiesResults.length > 0) {
      const activityResult = activitiesResults[0];
      return Promise.resolve(
        newActivity(
            activityResult.id.toString(),
            activityResult.name,
            activityResult.description,
            activityResult.duration,
        )
      )
    } else {
      return Promise.reject("no results found");
    }
}

// Get activity by name
export async function getByName(name) {
    const [activitiesResults] = await db.query("SELECT * FROM activities WHERE name = ?", name)
  
    if (activitiesResults.length > 0) {
      const activityResult = activitiesResults[0];
      return Promise.resolve(
        newActivity(
            activityResult.id.toString(),
            activityResult.name,
            activityResult.description,
            activityResult.duration,
        )
      )
    } else {
      return Promise.reject("no activity was found");
    }
}
