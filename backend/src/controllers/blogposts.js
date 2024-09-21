import { Router } from "express";
import * as Blogposts from "../models/blogposts.js";
import auth from "../middleware/auth.js";
import * as Users from "../models/users.js"

const blogPostController = Router();

//Create blogpost
blogPostController.post("/", auth(["member"]), async (req, res) => {
  // Get the blogpost data out of the request
  const blogpostData = req.body;
  const authenticationKey = req.get("X-AUTH-KEY")
  const currentUser = await Users.getByAuthenticationKey(authenticationKey)

  // Implement request validation
  if (!/^[a-zA-Z0-9\s!',.?]+$/.test(blogpostData.title)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid title",
    });
  }
  
  if (!/^[\s\S]{1,1000}$/.test(blogpostData.content)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid content",
    });
  }
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(blogpostData.datetime)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid datetime format",
    });
  }
  if (!/^\d+$/.test(blogpostData.user_id)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid ID format",
    });
  }

  if (currentUser.role !== "member") {
    return res.status(403).json({
      status: 403,
      message: "You do not have permission to create blog post",
    });
  }
  
  // Convert the blogpost data into an blogpost model object
  const blogpost = Blogposts.newBlogpost(
    null,
    blogpostData.datetime,
    blogpostData.title,
    blogpostData.content,
    blogpostData.user_id
  );

  // Use the create model function to insert this blogpost into the database
  Blogposts.create(blogpost)
    .then((blogpost) => {
      res.status(200).json({
        status: 200,
        message: "Created blogpost successfully",
        blogpost: blogpost,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create blogpost",
      });
    });
});

//Get all blogposts
blogPostController.get("/", async (req, res) => {
  const blogposts = await Blogposts.getAll();

  res.status(200).json({
    status: 200,
    message: "Get all blogposts",
    blogposts: blogposts,
  });
});

//Get blogpost by ID
blogPostController.get("/:id", (req, res) => {
  const blogpostID = req.params.id;

  Blogposts.getBlogByID(blogpostID)
    .then((blogpost) => {
      res.status(200).json({
        status: 200,
        message: "Get blogpost by ID",
        blogpost: blogpost,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get blogpost by ID",
      });
    });
});

//Get blogpost by user id
blogPostController.get("/user/:id", async (req, res) => {
  const userID = req.params.id;

  Blogposts.getByUserID(userID)
  .then((blogposts) => {
    res.status(200).json({
      status: 200,
      message: "Get blogpost by ID",
      blogposts: blogposts,
    });
  })
  .catch((error) => {
    res.status(500).json({
      status: 500,
      message: "Failed to get blogpost by user ID",
    });
  });
});

//Delete blogpost
blogPostController.delete("/:id", auth(["member"]), async (req, res) => {
  const blogpostID = req.params.id
  const authenticationKey = req.get("X-AUTH-KEY");

  const currentUser = await Users.getByAuthenticationKey(authenticationKey);
  if (!currentUser) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorised",
    });
  }
  const blogpost = await Blogposts.getBlogByID(blogpostID);
  if (!blogpost) {
    return res.status(404).json({
      status: 404,
      message: "Blogpost not found",
    });
  }

  if (blogpost.user_id.toString() !== currentUser.id) {
    return res.status(403).json({
      status: 403,
      message: "You do not have permission to delete this blogpost",
    });
  }

try {
  await Blogposts.deleteByID(blogpostID);
  res.status(200).json({
    status: 200,
    message: "Blog post deleted",
  });
} catch (error) {
  console.error("Error deleting blog post:", error);
  res.status(500).json({
    status: 500,
    message: "Failed to delete blog post",
  });
}
});

export default blogPostController;
