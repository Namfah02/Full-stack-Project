import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import logo from "../../common/img/high-street-gym-logo.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication";
import * as Bookings from "../../api/bookings";
import * as ClassTimetable from "../../api/classes";
import * as Activities from "../../api/activities";
import * as Locations from "../../api/locations";
import * as Users from "../../api/users";
import Spinner from "../../common/Spinner";

function CreateBookingPage() {
  const navigate = useNavigate();
  const [extendClass, setExtendClasses] = useState([]);
  const { activity_id, URLdate, time } = useParams();
  const [loading, setLoading] = useState(true);
  const [user] = useAuthentication();

  const [formData, setFormData] = useState({
    created_datetime: "",
    user_id: "",
    class_id: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const classes = await ClassTimetable.getAllByActivityDateTime(
        activity_id,
        URLdate,
        time
      );
      const extendedClasses = await Promise.all(
        classes.map(async (classItem) => {
          const classItemDate = new Date(classItem.date);
          const year = classItemDate.getFullYear();
          const month = String(classItemDate.getMonth() + 1).padStart(2, "0");
          const day = String(classItemDate.getDate()).padStart(2, "0");
          const formattedDate = `${year}-${month}-${day}`;
          const [activity, trainer, location] = await Promise.all([
            Activities.getActivityByID(classItem.activity_id),
            Users.getUsernameByID(classItem.trainer_id),
            Locations.getLocationByID(classItem.location_id),
          ]);
          return {
            ...classItem,
            activity,
            trainer,
            location,
            id: classItem.id,
            date: formattedDate,
          };
        })
      );
      setExtendClasses(extendedClasses);
      setLoading(false);

      if (extendedClasses.length > 0) {
        const defaultClass = extendedClasses.find(
          (classItem) =>
            classItem.location_id === parseInt(formData.location_id)
        );

      if (defaultClass) {
          setFormData((existing) => ({
            ...existing,
            trainer_id: defaultClass.trainer_id,
          }));
        }
      }
    };

    fetchData();
  }, [activity_id, URLdate, time, formData.location_id]);

  const [filteredTrainers, setFilteredTrainers] = useState([]);
  useEffect(() => {
    // Filter trainers based on the selected location
    const filteredTrainers = extendClass
      .filter(
        (classItem) => classItem.location_id === parseInt(formData.location_id)
      )
      .map(async (classItem) => {
        const trainer = await Users.getUsernameByID(classItem.trainer.id);
        return {
          id: classItem.trainer,
          trainer,
        };
      });

    Promise.all(filteredTrainers).then((result) => setFilteredTrainers(result));
  }, [formData.location_id, extendClass]);

  // Convert data to integer
  const trainerId = parseInt(formData.trainer_id);
  const locationId = parseInt(formData.location_id);
  const activityId = parseInt(activity_id);

  function createBooking(e) {
    e.preventDefault();

    if (!formData.location_id) {
      setStatusMessage("Please select a location");
      return;
    }

    if (!formData.trainer_id) {
      setStatusMessage("Please select a trainer");
      return;
    }

    setStatusMessage("Creating booking...");

    const classItem = extendClass.find(
      (c) =>
        c.time == time &&
        c.trainer_id == trainerId &&
        c.location_id == locationId &&
        c.activity_id == activityId &&
        c.date == URLdate
    );

    // Convert the date and time to MySQL datetime format
    const currentDatetime = new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const bookingData = {
      ...formData,
      created_datetime: currentDatetime,
      user_id: user.id,
      class_id: classItem.id,
    };

    Bookings.create(bookingData, user.authenticationKey)
      .then((result) => {
        if (result.status === 200) {
          setStatusMessage(result.message);
          navigate("/bookings");

          if (typeof onAdded === "function") {
            onAdded();
          }
        } else {
          setStatusMessage(result.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setStatusMessage(`Failed to create booking: ${error.message}`);
      });
  }

  return (
    <main className="bg-gradient-to-r from-gray-200">
      <Header />
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <img className="w-48 h-auto rounded-full m-5" src={logo} alt="logo" />
        <h2 className="text-red-500 text-2xl font-bold max-w-md">
          Create your booking
        </h2>
        {loading ? (
          <Spinner />
        ) : (
          <form onSubmit={createBooking}>
            <div className="flex flex-col mb-5 mx-auto items-center w-screen lg:w-96">
              {extendClass.length > 0 && (
                <div className="flex flex-col items-center text-center">
                  <p className="text-xl font-bold text-red-500 m-2">
                    {extendClass[0].activity.name}
                  </p>
                  <p className="font-bold m-2 max-w-lg">
                    {extendClass[0].activity.description}
                  </p>
                  <p>Date: {extendClass[0].date}</p>
                  <p>Time: {extendClass[0].time}</p>
                  <p>Duration: {extendClass[0].activity.duration} mins</p>
                </div>
              )}
            </div>
            <div className="form-control w-full">
              <div>
                <label className="label">
                  <span className="label-text text-l font-bold text-red-500">
                    Location:
                  </span>
                </label>
                <select
                  defaultValue={"default"}
                  className="select select-bordered w-full "
                  value={formData.location_id}
                  onChange={(e) =>
                    setFormData((existing) => ({
                      ...existing,
                      location_id: e.target.value,
                    }))
                  }
                >
                  <option value="default" disabled>
                    Select location
                  </option>
                  {[
                    ...new Map(
                      extendClass.map((item) => [item.location_id, item])
                    ).values(),
                  ].map((extendClass) => (
                    <option
                      key={extendClass.location_id}
                      value={extendClass.location_id}
                    >
                      {extendClass.location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-l font-bold text-red-500">
                    Trainer:
                  </span>
                </label>
                <select
                  defaultValue={"default"}
                  className="select select-bordered w-full"
                  value={formData.trainer_id}
                  onChange={(e) =>
                    setFormData((existing) => ({
                      ...existing,
                      trainer_id: e.target.value,
                    }))
                  }
                >
                  <option value="default" disabled>
                    Select trainer
                  </option>
                  {extendClass
                    .filter(
                      (item) =>
                        item.location_id === parseInt(formData.location_id)
                    )
                    .map((classItem) => (
                      <option
                        key={classItem.trainer.id}
                        value={classItem.trainer.id}
                      >
                        {`${classItem.trainer.firstname} ${classItem.trainer.lastname}`}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-around m-5">
              <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-5 border-b-4 border-red-700 hover:border-red-500 rounded">
                Confirm
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 border-b-4 m-5 hover:border-gray-500 rounded "
                onClick={() => navigate("/timetable")}
              >
                Back
              </button>
            </div>
            <label className="label">
              <span className="label-text-alt">{statusMessage}</span>
            </label>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}
export default CreateBookingPage;
