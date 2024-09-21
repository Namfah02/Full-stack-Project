import { Footer } from "../../common/Footer"
import { Header } from "../../common/Header"
import { Nav } from "../../common/NavBar"
import { useEffect, useState } from "react"
import * as Users from "../../api/users"
import { useAuthentication } from "../authentication"
import Spinner from "../../common/Spinner"
import UserEdit from"./UserEdit.jsx"

function UserPage() {
  const [user] = useAuthentication()
  const [refreshTrigger, setRefreshTrigger] = useState()
  const [editedUserID, setEditedUserID] = useState(null)

  const [users, setUsers] = useState([])
  useEffect(() => {
    Users.getAll(user && user.authenticationKey)
        .then(users => {
            setUsers(users)
        })
}, [refreshTrigger])

return (
  <main className="bg-gradient-to-r from-gray-200">
    <Header />
    <Nav />
    <div className="min-h-screen container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2">
      <div className="overflow-x-auto pt-0 pl-0 sm:pt-11 sm:pl-4 lg:mr-20">
        <h2 className="block text-red-500 text-2xl font-bold pl-4 mb-2">Users</h2>
        <div className="table table-responsive w-full">
          {users === null ? (
            <Spinner />
          ) : (
            <div className="table-wrapper">
              <table className="table w-full mb-4">
                <thead>
                  <tr className="md:text-xl">
                    <th className="border border-slate-300">Name</th>
                    <th className="border border-slate-300">Role</th>
                    <th className="border border-slate-300">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="border border-slate-300">{user.firstName} {user.lastName}</td>
                      <td className="border border-slate-300">{user.role}</td>
                      <td className="border border-slate-300 flex justify-center">
                        <button
                          className="bg-red-500 hover:bg-red-400 text-white font-bold p-2 border-b-2 border-red-700 hover:border-red-500 rounded"
                          onClick={() => setEditedUserID(user.id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div>
        <h2 className="block text-red-500 text-2xl font-bold mt-12 pl-4">
          Edit user
        </h2>
        <UserEdit
          userID={editedUserID}
          onSave={() => setRefreshTrigger({})}
          accessRole={true}
        />
      </div>
    </div>
    <Footer />
  </main>
);

}
export default UserPage