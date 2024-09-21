import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import { useEffect, useState } from "react";
import * as Classes from "../../api/classes";
import classImg from "../../common/img/classes-img.jpg";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Activities from "../../api/activities";
import Spinner from "../../common/Spinner"

function TimetablePage() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();
  const [user] = useAuthentication();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    Classes.getAllTimetable()
      .then(async (classes) => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const oneWeekLater = new Date(currentDate);
        oneWeekLater.setDate(oneWeekLater.getDate() + 7); // Get the date one week later

        const classesWithExtras = await Promise.all(
          classes.map(async (classTimetable) => {
            const classDate = new Date(classTimetable.date);
            const activity = await Activities.getActivityByID(
              classTimetable.activity_id
            );

            // Display only upcoming classes within the next week
            if (classDate >= currentDate && classDate <= oneWeekLater) {
              const weekday = classDate.toLocaleDateString("en-AU", {
                weekday: "long",
              });
              const dateString = classDate.toLocaleDateString("en-AU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              const URLdate = `${classDate.getFullYear()}-${(
                classDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${classDate
                .getDate()
                .toString()
                .padStart(2, "0")}`;

              return {
                date: classDate,
                weekday,
                dateString,
                activity,
                duration: classTimetable.activity_id,
                activity_id: classTimetable.activity_id,
                URLdate,
                time: classTimetable.time,
              };
            } else {
              return null; // Exclude past classes and classes more than one week
            }
          })
        );

        // Filter out null values (past classes and classes more than one week)
        const filteredClasses = classesWithExtras.filter(
          (classItem) => classItem !== null
        );

        // Group classes by weekday and date
        const groupedClasses = {};
        filteredClasses.forEach((classItem) => {
          const key = `${classItem.weekday}: ${classItem.dateString}`;
          if (!groupedClasses[key]) {
            groupedClasses[key] = [];
          }
          groupedClasses[key].push(classItem);
        });

        // Sort classes by date within each weekday group
        Object.keys(groupedClasses).forEach((key) => {
          groupedClasses[key].sort((a, b) => a.date - b.date);
        });

        setClasses(groupedClasses);
      })
      .finally(() => setLoading(false));
  }, []);

  function Timepassed(classDate, classTime) {
    const now = new Date();
    const classDateTime = new Date(classDate);
    const [classHour, classMinute] = classTime.split(':');
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
  
    // Check if the class date is not today
    if (classDateTime.toDateString() !== now.toDateString()) {
      return false; 
    }

    // Class date is today
    return (
      parseInt(classHour) < parseInt(currentHour) ||
      (parseInt(classHour) === parseInt(currentHour) &&
        parseInt(classMinute) <= parseInt(currentMinute))
    );
  }
  

  return (
    <main className="bg-gradient-to-r from-gray-200">
      <Header />
      <Nav />
      <div className="min-h-screen flex flex-col md:mx-60">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md">
          Timetable
        </h2>
        {loading ? (
          <Spinner />
        ) : (
          Object.keys(classes).map((weekday) => (
            <div key={weekday} className="flex flex-col">
              <h3 className="text-2xl font-bold m-6 mx-auto">{weekday}</h3>
              <div className="lg:flex justify-center flex-wrap">
                {classes[weekday].map((classTimetable) => (
                  <div
                    key={`${classTimetable.date}-${classTimetable.time}-${classTimetable.activity_id}`}
                    className="card lg:w-96 h-96 mb-6 bg-base-100 shadow-xl hover:bg-gray-200 transition-colors duration-300 lg:m-8"
                  >
                    <figure>
                      <img src={classImg} alt="class image" />
                    </figure>
                    <div className="card-body p-3">
                      <h2 className="card-title text-2xl flex justify-center">
                        {classTimetable.activity.name}
                      </h2>
                      <div className="flex flex-row text-center">
                        <p className="text-xl">
                          Duration: {classTimetable.activity.duration} mins
                        </p>
                        <p className="text-xl">Time: {classTimetable.time}</p>
                      </div>
                    </div>
                    {user && user.role === "member" && !Timepassed(classTimetable.date, classTimetable.time) ? (
                      <button
                        className="btn text-red-500 text-xl m-4"
                        onClick={() =>
                          navigate(
                            "/classes/" +
                              classTimetable.activity_id +
                              "/" +
                              classTimetable.URLdate +
                              "/" +
                              classTimetable.time
                          )
                        }
                      >
                        Book now!
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </main>
  );
}

export default TimetablePage;
