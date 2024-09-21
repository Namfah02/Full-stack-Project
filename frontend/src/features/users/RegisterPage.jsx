import { Footer } from "../../common/Footer";
import { Header } from "../../common/Header";
import { useNavigate } from "react-router-dom";
import logo from "../../common/img/high-street-gym-logo.jpg";
import { useState } from "react";
import * as Users from "../../api/users";
import { useAuthentication } from "../authentication";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");
  const [user, login, logout] = useAuthentication();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
    password: "",
  });

  function onRegisterSubmit(e) {
    e.preventDefault();
    setStatusMessage("Registering....");

    //client side validation
    if (!/^[a-zA-Z\-]+$/.test(formData.firstName)) {
      setStatusMessage("Invalid first name");
      return;
    }

    if (!/^[a-zA-Z\-]+$/.test(formData.lastName)) {
      setStatusMessage("Invalid last name");
      return;
    }
    //Phone
    if (
      !/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(
        formData.phone
      )
    ) {
      setStatusMessage("Invalid phone number format");
      return;
    }
    //address
    if (!/^[a-zA-Z0-9\s,'-]+$/.test(formData.address)) {
      setStatusMessage("Invalid address");
      return;
    }
    //email
    if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(formData.email)) {
      setStatusMessage("Invalid email");
      return;
    }
    //password
    if (!/[a-zA-Z0-9-]{6,}/.test(formData.password)) {
      setStatusMessage(
        "Password must be at least 6 characters and contain a variety of characters."
      );
      return;
    }

    // Send register to backend
    Users.registerUser(formData)
      .then((result) => {
        setStatusMessage(result.message);
        // Only proceed to login if registration was successful
        if (result.status === 200) {
          login(formData.email, formData.password)
            .then((result) => {
              setStatusMessage(result.message);
              navigate("/timetable");
            })
            .catch((error) => {
              setStatusMessage("Login failed: " + error);
            });
        }
      })
      .catch((error) => {
        setStatusMessage("Registration failed: " + error);
      });
  }

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <form
        className="min-h-screen p-2 flex flex-col  md:px-60 "
        onSubmit={onRegisterSubmit}
      >
        <div className="flex flex-col items-center p-4">
          <img className="w-48 h-auto rounded-full" src={logo} alt="logo" />
        </div>
        <label className="flex flex-col items-center text-red-500 text-2xl font-bold m-5 mx-auto max-w-md ">
          Register
        </label>
        <input
          className="input input-bordered w-full mb-5"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <input
          className="input input-bordered w-full mb-5"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <input
          className="input input-bordered w-full mb-5"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          className="input input-bordered w-full mb-5"
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <input
          className="input input-bordered w-full mb-5"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          className="input input-bordered w-full mb-5"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <div className=" flex items-center justify-around">
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
            Register
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 border-b-4 hover:border-gray-500 rounded"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <label className="label">
          <span className="label-text-xl mx-4">{statusMessage}</span>
        </label>
      </form>
      <Footer />
    </main>
  );
}

