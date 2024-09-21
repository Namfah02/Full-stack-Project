import { Footer } from "../../common/Footer";
import { Header } from "../../common/Header";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../common/img/high-street-gym-logo.jpg";
import { useAuthentication } from "../authentication";

function LoginPage() {
  const navigate = useNavigate();
  const [user, login, logout ] = useAuthentication()
  const [statusMessage, setStatusMessage] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  function onLoginSubmit(e) {
    e.preventDefault()
    setStatusMessage("Logging in...")

    if(!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/.test(formData.email)) {
      setStatusMessage("Invalid email address, try again")
      return
    }

    login(formData.email, formData.password).then(result => {
      setStatusMessage("Login successful")
      navigate("/timetable")
    }).catch(error => {
      setStatusMessage("Login failed: " + error)
    })
  }

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <form className="min-h-screen p-2 flex flex-col md:px-60 "
      onSubmit={onLoginSubmit}
       >
        <div className="flex flex-col items-center p-4">
          <img className="w-48 h-auto rounded-full" src={logo} alt="logo" />
        </div>
        <label className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md ">
          Login
        </label>
        <input
          className="input input-bordered w-full mb-5 "
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) =>
            setFormData((existing) => {
              return { ...existing, email: e.target.value };
            })
          }
        />
        <input
          className="input input-bordered w-full mb-5 "
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData((existing) => {
              return { ...existing, password: e.target.value };
            })
          }
        />
        <div className=" flex items-center justify-around">
          <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
            Login
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 border-b-4 hover:border-gray-500 rounded "
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>
        <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
      </form>
      <Footer />
    </main>
  );
}
export default LoginPage;