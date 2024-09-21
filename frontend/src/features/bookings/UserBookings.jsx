import { useEffect, useState } from "react";
import * as Users from "../../api/users";
import * as ClassTimetable from "../../api/classes";
import * as Bookings from "../../api/bookings";
import * as Activities from "../../api/activities";
import * as Locations from "../../api/locations";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";
import Spinner from "../../common/Spinner";

export default function UserBookings({ userID, refreshDependency }) {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState();
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    Bookings.getByUserID(userID).then(async (bookings) => {
      const bookingsWithExtras = await Promise.all(
        bookings.map(async (booking) => {
          const classTimetable = await ClassTimetable.getClassByID(
            booking.class_id
          );
          const activity = await Activities.getActivityByID(
            classTimetable.activity_id
          );
          const trainer = await Users.getUsernameByID(classTimetable.trainer_id);
          const location = await Locations.getLocationByID(
            classTimetable.location_id
          );
          const classDate = new Date(classTimetable.date);

          // Exclude past class dates
          if (classDate >= currentDate) {
            return {
              id: booking.id,
              classDate: classDate.toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              classTime: classTimetable.time,
              location,
              trainer,
              activity,
            };
          }
          return null; // Skip past classes
        })
      );

      // Filter out null values (past classes)
      const upcomingBookings = bookingsWithExtras.filter(
        (booking) => booking !== null
      );

      // Sort by class date (upcoming first)
      upcomingBookings.sort(
        (a, b) => new Date(a.classDate) - new Date(b.classDate)
      );

      setBookings(upcomingBookings);
      setLoading(false); 
    });
  }, [refreshDependency, refreshTrigger]);

  const handleCancelBooking = async (bookingID) => {
    Bookings.remove(bookingID, user.authenticationKey)
      .then((result) => {
        setStatusMessage("Cancel booking successful");
        setRefreshTrigger(Date.now());
      })
      .catch((error) => {
        setStatusMessage("Failed to cancel booking: " + error);
      });
  };

  const navigateToTimetable = () => {
    navigate("/timetable"); 
  };

  return (
    <>
    {loading ? ( 
        <Spinner />
      ) : (
      <div className="min-h-screen p-2 flex flex-col md:px-60">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md">
          Bookings
        </h2>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
           <h3>No booking upcoming</h3>
          <button
            className="btn btn-error  mt-6 "
            onClick={navigateToTimetable}
          >
            Book now
          </button>
          </div>
        ) : (
          <>
            <h3 className="block text-black text-xl mb-2 mx-auto max-w-md">
              Classes upcoming
            </h3>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="card w-97 bg-gray-100 shadow-xl my-2 hover:bg-gray-200 transition-colors duration-300"
              >
                <div className="card-body">
                  <div className="flex items-center mb-2">
                    <p className="card-title">{booking.activity.name}</p>
                    <p className="card-actions justify-end">
                      Booking No: {booking.id}
                    </p>
                  </div>
                  <div className="flex mb-2">
                    <p>Location: {booking.location.name}</p>
                    <p className="card-actions justify-end">
                      Trainer: {booking.trainer.firstname} {booking.trainer.lastname}
                    </p>
                  </div>
                  <div className="card-actions items-center justify-between">
                    <p>
                      Class Date: {booking.classDate}, {booking.classTime}
                    </p>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <label className="label">
          <span className="label-text-xl mx-4">{statusMessage}</span>
        </label>
      </div>
      )}
    </>
  );
}

