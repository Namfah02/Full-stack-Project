import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import logo from "../../common/img/high-street-gym-logo.jpg";
import { useAuthentication } from "../authentication";
import { useEffect, useState } from "react";
import * as Users from "../../api/users";
import * as Classes from "../../api/classes"
import * as Activities from "../../api/activities"
import * as Locations from "../../api/locations"
import { useNavigate } from "react-router-dom";
import Spinner from "../../common/Spinner"; 

function ImportListPage() {
  const [user] = useAuthentication();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  useEffect(() => {
    Users.getAll(user && user.authenticationKey).then((users) => {
      const memberUsers = users.filter((u) => u.role === "member");
      setUsers(memberUsers);
    });
  }, []);

  const [classes, setClasses] = useState([]);
  useEffect(() => {
    Classes.getAllClasses().then(async (classes) => {
      const classesWithExtras = await Promise.all(
        classes.map(async (classTimetable) => {
          const classDate = new Date(classTimetable.date);
          const activity = await Activities.getActivityByID(
            classTimetable.activity_id
          );
          const trainer = await Users.getUserByID(classTimetable.trainer_id, user.authenticationKey);
          const location = await Locations.getLocationByID(
            classTimetable.location_id
          );
          const dateString = classDate.toLocaleDateString("en-AU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return {
            id: classTimetable.id,
            dateString,
            time: classTimetable.time,
            activity,
            trainer,
            location,
          };
        })
      );
      // Display by class date upcoming
      classesWithExtras.sort(
        (a, b) => new Date(a.dateString) - new Date(b.dateString)
      );
      setClasses(classesWithExtras);
      setLoading(false);
    });
  }, []);

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <Nav />
      <div className="min-h-screen p-4 flex flex-col items-center justify-center lg:mt-8">
        <img className="w-48 h-auto rounded-full " src={logo} alt="logo" />
        <h2 className="text-red-500 text-xl font-bold m-4">Import Lists</h2>
        <button
            onClick={() => navigate("/import")}
            className="btn btn-outline btn-error btn-sm mt-2"
          >
            Import file
          </button>
          {loading ? ( 
          <Spinner />
        ) : (
        <div className="lg:flex flex-row">
          <div className="mx-36">
            <div className="table-responsive">
              <h2 className="text-red-500 text-xl font-bold my-4 text-center">Member Lists</h2>
              <table className="table">
                <thead>
                  <tr className="md:text-xl">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.firstName} {user.lastName}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mx-36">
            <div className="table-responsive">
              <h2 className="text-red-500 text-xl font-bold my-4 text-center">Class Timetable</h2>
              <table className="table">
                <thead>
                  <tr className="md:text-xl">
                    <th>ID</th>
                    <th>Date time</th>
                    <th>Activity</th>
                    <th>Trainer</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((classTimetable) => (
                    <tr key={classTimetable.id}>
                      <td>
                        {classTimetable.id}
                      </td>
                      <td>
                        {classTimetable.dateString}, {classTimetable.time}
                      </td>
                      <td>{classTimetable.activity.name}</td>
                      <td>
                        {classTimetable.trainer.firstName} {classTimetable.trainer.lastName}
                      </td>
                      <td>{classTimetable.location.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

export default ImportListPage;
