import { useAuthentication } from "../authentication";
import { useEffect, useState } from "react";
import * as Classes from "../../api/classes";
import * as Activities from "../../api/activities"
import * as Locations from "../../api/locations"

function TrainerClasses({ userID, refreshDependency }) {
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState();
  const [statusMessage, setStatusMessage] = useState("");
  const [classes, setClasses] = useState([]);

useEffect(() => {
  Classes.getClassByTrainerID(userID).then(async (classes) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const upcomingClasses = classes.filter(classTimetable => new Date(classTimetable.date) >= currentDate);

    const classesWithExtras = await Promise.all(
      upcomingClasses.map(async (classTimetable) => {
        const activity = await Activities.getActivityByID(classTimetable.activity_id);
        const location = await Locations.getLocationByID(classTimetable.location_id);
        return {
          id: classTimetable.id,
          activity,
          location,
          date: new Date(classTimetable.date).toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          time: classTimetable.time
        };
      })
    );

    // Display by class date upcoming
    classesWithExtras.sort((a, b) => new Date(a.date) - new Date(b.date));
    setClasses(classesWithExtras);
  });
}, [refreshDependency, refreshTrigger]);


  return (
    <>
      <div className="min-h-screen p-2 flex flex-col md:px-60">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md ">
          My training classes
        </h2>
        <ul className="flex flex-col gap-4">
          {classes.map((classTimetable) => (
            <li key={classTimetable.id}>
              <div className="card w-full bg-gray-100 shadow-xl my-4 hover:bg-gray-200 transition-colors duration-300">
                <div className="card-body flex flex-row justify-between">
                  <div>
                    <h2 className="card-title my-4">{classTimetable.activity.name}</h2>
                    <p>Location: {classTimetable.location.name}</p>
                  </div>
                  <div>
                    <p className="my-4">Date: {classTimetable.date}</p>
                    <p className="my-4">Time: {classTimetable.time}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
          <label className="label">
            <span className="label-text-xl mx-4">{statusMessage}</span>
          </label>
        </ul>
      </div>
    </>
  );
}
export default TrainerClasses;