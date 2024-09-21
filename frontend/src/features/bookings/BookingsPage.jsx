import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import { useState } from "react";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";
import UserBookings from "./UserBookings";

function BookingsPage({}) {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState();

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <Nav />

      <div className="min-h-screen flex flex-col md:px-60">
        {user ? 
          <UserBookings userID={user.id} refreshDependency={refreshTrigger} />
         : 
          <Spinner />
        }
      </div>
      <Footer />
    </main>
  );
}
export default BookingsPage