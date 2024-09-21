import { useEffect, useState } from "react"
import { useAuthentication } from "../authentication"
import * as Users from "../../api/users"


export default function UserEdit({ userID, onSave, accessRole }) {
  const [statusMessage, setStatusMessage] = useState("")
  const [user, , , refresh] = useAuthentication()

  const [formData, setFormData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    role: "member",
    email: "",
    password: "",
    phone: "",
    address: "",
    authenticationKey: null,
  })

  useEffect(() => {
    if (userID) {
      Users.getUserByID(userID, user.authenticationKey).then((user) => {
        setFormData(user)
      })
    }
  }, [userID])

  // Clear user data in the form
  function clear() {
    setFormData({
      id: null,
      firstName: "",
      lastName: "",
      role: "member",
      email: "",
      password: "",
      phone: "",
      address: "",
      authenticationKey: null,
    })
    setStatusMessage("")
  }

  function upsert() {
    if (formData.id) {
      setStatusMessage("Updating user...")
      Users.update(formData, user.authenticationKey).then((result) => {
        setStatusMessage(result.message)

        if (typeof onSave === "function") {
          onSave()
        }

        if (formData.id == user.id) {
          refresh()
        }
      })
    } else {
      setStatusMessage("Creating user...")
      Users.create(formData, user.authenticationKey).then((result) => {
        setStatusMessage(result.message)

        if (typeof onSave === "function") {
          onSave()
        }

        setFormData((existing) => ({ ...existing, id: result.user.id }))
      })
    }
  }

  return <div>
      <form className="my-2" >
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
        <select
          className="select select-bordered w-full mb-6"
          value={formData.role}
          onChange={(e) =>
            setFormData((existing) => {
              return { ...existing, role: e.target.value }
            })
          }
          disabled={!accessRole}
        >
          <option value="manager">Manager</option>
          <option value="trainer">Trainer</option>
          <option value="member">Member</option>
        </select>
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
        <div className="m-6">
          <input
            type="button"
            value={formData.id ? "Update" : "Insert"}
            onClick={() => upsert()}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 border-b-4 border-red-700 hover:border-red-500 rounded"
          /> 
          <input
            type="button"
            value="Clear"
            onClick={() => clear()}
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 m-2 border-b-4 hover:border-gray-500 rounded"
          />

          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
      </div>
  
}
