import { Footer } from "../../common/Footer";
import { Header } from "../../common/Header";
import { Nav } from "../../common/NavBar";
import * as Blogposts from "../../api/blogposts";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Users from "../../api/users";
import { useAuthentication } from "../authentication";
import Spinner from "../../common/Spinner";

function PostDetailsPage() {
  const { blogpostID } = useParams();
  const [loggedInUser] = useAuthentication()
  const navigate = useNavigate();
  const [blogpost, setBlogpost] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    Blogposts.getBlogByID(blogpostID)
      .then(async (blogpost) => {
        const user = await Users.getUsernameByID(blogpost.user_id);
        const blogpostWithExtras = {
          id: blogpost.id,
          title: blogpost.title,
          content: blogpost.content,
          datetime: new Date(blogpost.datetime).toLocaleDateString(),
          user: user,
        };
        setBlogpost(blogpostWithExtras);
        setLoading(false);
      })
      .catch((error) => console.log(error));
      setLoading(false);
  }, [blogpostID]);

  return (
    <main className=" bg-gradient-to-r from-gray-200 ">
      <Header />
      <Nav />
      <div className="min-h-screen p-2 flex flex-col bg-gradient-to-r  from-gray-200 md:px-60 ">
        <h2 className="block text-red-500 text-2xl font-bold m-5 mx-auto max-w-md">
          Blog Post Details
        </h2>
        {loading ? ( 
          <Spinner />
        ) : (
        <div>
          {blogpost && (
            <div className="card w-full bg-gray-100 shadow-xl my-4 hover:bg-gray-300 transition-colors duration-300">
              <div className="card-body flex lg:flex-row justify-between">
                <div>
                  <h2 className="card-title">{blogpost.title}</h2>
                  <p className="mr-6">{blogpost.content}</p>
                </div>
                <div className="flex flex-col">
                  <p>Written by: </p>
                  <p>{blogpost.user.firstname} {blogpost.user.lastname}</p>
                  <p>{blogpost.datetime}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
        <div className="flex justify-center m-2">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-active btn-neutral max-w-max"
        >
          Back
        </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
export default PostDetailsPage;