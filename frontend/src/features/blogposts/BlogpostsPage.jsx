import { Nav } from "../../common/NavBar";
import { Header } from "../../common/Header";
import { Footer } from "../../common/Footer";
import * as Blogposts from "../../api/blogposts";
import * as Users from "../../api/users";
import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";
import Spinner from "../../common/Spinner";

function BlogPostsPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [loggedInUser] = useAuthentication();
  const [user, setUser] = useState(null)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState();
  const [formData, setFormData] = useState({
    datetime: "",
    title: "",
    content: "",
    user_id: "",
  });

  function onPostSubmit(e) {
    e.preventDefault();
    setStatusMessage("Creating post....");

    //client side validation
    if (!/^[a-zA-Z0-9\s!',.?]+$/.test(formData.title)) {
      setStatusMessage("Invalid title");
      return;
    }

    if (!/^[\s\S]{1,1000}$/.test(formData.content)) {
      setStatusMessage("Invalid content");
      return;
    }

    // Convert the date and time to MySQL datetime format
    const datetime = new Date().toISOString().slice(0, 19).replace("T", " ");
    const blogData = {
      ...formData,
      datetime: datetime,
      user_id: loggedInUser.id,
    };
    // Send post to backend
    Blogposts.createBlogpost(blogData, loggedInUser.authenticationKey)
    .then((result) => {
      if (result.status === 200) {
        setStatusMessage("Created post successful");
        setFormData({
          datetime: "",
          title: "",
          content: "",
          user_id: "",
        });
  
      } else {
        setStatusMessage("Failed to create post: " + result.message);
      }
    })
    .catch((error) => {
      setStatusMessage(`Failed to create post: ${error.message}`);
    });
  }  

  const [blogposts, setBlogposts] = useState([]);
useEffect(() => {
  Blogposts.getAll().then(async (blogposts) => {
    const blogpostsWithExtras = await Promise.all(
      blogposts.map(async (blogpost) => {
        const writer = await Users.getUsernameByID(blogpost.user_id);
          return {
            id: blogpost.id,
            datetime: new Date(blogpost.datetime).toLocaleDateString(),
            title: blogpost.title,
            content: blogpost.content,
            writer,
          };
        
  
      })
    );
    setRefreshTrigger(Date.now());
    setBlogposts(blogpostsWithExtras);
    setLoading(false);
  });
}, [refreshTrigger]);


  function cancelUpload() {
    setFormData({
      datetime: "",
      title: "",
      content: "",
      user_id: "",
    });
    setStatusMessage("");
  }

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <Nav />
      <div className="min-h-screen p-2 flex flex-col bg-gradient-to-r from-gray-200 md:px-60 ">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md">
          Blog Posts
        </h2>
        {loggedInUser && loggedInUser.role == "member" ? (
          <form className="form" onSubmit={onPostSubmit}>
            <div className="md:w-full">
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  className="appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight my-3 focus:outline-none focus:bg-white focus:border-black"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <textarea
                  placeholder="What is on you mind?"
                  rows="5"
                  className="appearance-none border-2 border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight my-3 focus:outline-none focus:bg-white focus:border-black"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <div className=" flex items-center justify-around">
              <button className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded">
                Post
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 border-b-4 hover:border-gray-500 rounded "
                type="button"
                onClick={cancelUpload}
              >
                Cancel
              </button>
            </div>
            <label className="label">
              <span className="label-text-xl mx-4">{statusMessage}</span>
            </label>
          </form>
         ) : (
           <></>
         )}
          {loading ? ( 
          <Spinner />
        ) : (
        <ul className="flex flex-col gap-4">
          {blogposts.map((blogpost) => (
            <li key={blogpost.id}>
              <div className="card w-full bg-gray-100 shadow-xl my-4 hover:bg-gray-300 transition-colors duration-300">
                <div className="card-body flex flex-row justify-between">
                  <div className="mr-7">
                    <h2 className="card-title">{blogpost.title}</h2>
                    <p>{blogpost.content}</p>
                  </div>
                  <div>
                    <p>{blogpost.writer.firstname} {blogpost.writer.lastname}</p>
                    <p>{blogpost.datetime}</p>
                    <button
                      onClick={() => navigate("/blogs/" + blogpost.id)}
                      className="btn btn-outline btn-error btn-sm mt-2"
                    >
                      Read more..
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
      <Footer />
    </main>
  );
}
export default BlogPostsPage;
