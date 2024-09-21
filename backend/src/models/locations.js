import { db } from "../database.js"

export function newLocation (
    id,
    name,
) {
    return {
        id,
        name,
    }
}

// Get all location
export async function getAll() {
    const [allLocationsResults] = await db.query("SELECT * FROM locations")

    return await allLocationsResults.map((locationResult) =>
        newLocation(
            locationResult.id.toString(),
            locationResult.name
        ))
}

// Get location by location ID
export async function getLocationByID(locationId) {
    const [locationsResults] = await db.query("SELECT * FROM locations WHERE id = ?", locationId)
  
    if (locationsResults.length > 0) {
      const locationResult = locationsResults[0];
      return Promise.resolve(
        newLocation(
            locationResult.id.toString(),
            locationResult.name
        )
      )
    } else {
      return Promise.reject("no results found");
    }
}

// Get location by name
export async function getByName(name) {
    const [locationsResults] = await db.query("SELECT * FROM locations WHERE name = ?", name)
  
    if (locationsResults.length > 0) {
      const locationResult = locationsResults[0];
      return Promise.resolve(
        newLocation(
            locationResult.id.toString(),
            locationResult.name
        )
      )
    } else {
      return Promise.reject("no location was found");
    }
}

