import { useAuthentication } from "../authentication";
import { useEffect, useState } from "react";
import * as Blogposts from "../../api/blogposts";
import { useNavigate } from "react-router-dom";

function UserBologposts({ userID, refreshDependency }) {
  const [user] = useAuthentication();
  const [refreshTrigger, setRefreshTrigger] = useState();
  const navigate = useNavigate();

  const [statusMessage, setStatusMessage] = useState("");

  const [blogposts, setBlogposts] = useState([]);
  useEffect(() => {
    Blogposts.getByUserID(userID).then(async (blogposts) => {
      const sortedBlogposts = blogposts.sort((a, b) => {
        // Convert datetime strings to Date objects for comparison
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        // Sort in descending order
        return dateB - dateA;
      });
  
      const blogpostsWithExtras = await Promise.all(
        sortedBlogposts.map(async (blogpost) => {
          return Promise.resolve({
            id: blogpost.id,
            datetime: new Date(blogpost.datetime).toLocaleDateString(),
            title: blogpost.title,
            content: blogpost.content,
          });
        })
      );
  
      setBlogposts(blogpostsWithExtras);
    });
  }, [refreshDependency, refreshTrigger]);
  

  const handleDelete = async (blogpostID) => {
    Blogposts.remove(blogpostID, user.authenticationKey)
      .then((result) => {
        setStatusMessage("Delete post successful");
        setRefreshTrigger(Date.now());
      })
      .catch((error) => {
        setStatusMessage("Failed to delete post: " + error);
      });
  };
  const navigateToBlogpost = () => {
    navigate("/blogs"); 
  };
  

  return (
    <>
      <div className="min-h-screen p-2 flex flex-col md:px-60">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md ">
          My blog post
        </h2>
        {blogposts.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
          <button
            className="btn btn-outline btn-error mt-6 "
            onClick={navigateToBlogpost}
          >
            Create new post
          </button>
          </div>
        ) : (
        <ul className="flex flex-col gap-4">
          {blogposts.map((blogpost) => (
            <li key={blogpost.id}>
              <div className="card w-full bg-gray-100 shadow-xl my-4 hover:bg-gray-200 transition-colors duration-300">
                <div className="card-body flex flex-row justify-between">
                  <div>
                    <h2 className="card-title my-4">{blogpost.title}</h2>
                    <p>{blogpost.content}</p>
                  </div>
                  <div>
                    <p className="my-4">{blogpost.datetime}</p>
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleDelete(blogpost.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        )}
        <label className="label">
            <span className="label-text-xl mx-4">{statusMessage}</span>
          </label>
      </div>
    </>
  );
}
export default UserBologposts;
