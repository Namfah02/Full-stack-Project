import { Router } from "express";
import * as Users from "../models/users.js";
import auth from "../middleware/auth.js";
import bcrypt from "bcryptjs";
import { v4 as uuid4 } from "uuid";
import xml2js from "xml2js";


const userController = Router();

//Login
userController.post("/login", (req, res) => {
  // access request body
  let loginData = req.body;

  //  Implement request validation
  if (!loginData.email || !loginData.password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
    });
  }

  if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(loginData.email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
    });
  }

  Users.getByEmail(loginData.email)
    .then((user) => {
      if (bcrypt.compareSync(loginData.password, user.password)) {
        user.authenticationKey = uuid4().toString();

        Users.update(user).then((result) => {
          res.status(200).json({
            status: 200,
            message: "Logged in successfully",
            authenticationKey: user.authenticationKey,
          });
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "invalid credentials",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to login",
      });
    });
});

//Logout
userController.post("/logout", (req, res) => {
  const authenticationKey = req.get("X-AUTH-KEY");
  Users.getByAuthenticationKey(authenticationKey)
    .then((user) => {
      user.authenticationKey = null;
      Users.update(user).then((user) => {
        res.status(200).json({
          status: 200,
          message: "Logged out successfully",
        });
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to logout",
      });
    });
});

//Register
userController.post("/register", async (req, res) => {
  // Get the user data out of the request
  const userData = req.body;

  const userAlreadyExists = await Users.getByEmail(userData.email)

  if (userAlreadyExists) {
      res.status(409).json({
          status: 409,
          message: "The provided email address is already associated with an account."
      })
      return;
  }

  // Implement request validation
  if (!/^[a-zA-Z\-]+$/.test(userData.firstName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid first name",
    });
  }
  
  if (!/^[a-zA-Z\-]+$/.test(userData.lastName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid last name",
    });
  }
  
  if (!/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(userData.phone)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid phone number format",
    });
  }
  
  if (!/^[a-zA-Z0-9\s,'\/-]+$/.test(userData.address)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid address",
    });
  }
  
  if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(userData.email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
    });
  }
  
  if (!/[a-zA-Z0-9-]{6,}/.test(userData.password)) {
    return res.status(400).json({
      status: 400,
      message: "Password must be at least 6 characters and contain a variety of characters.",
    });
  }
  
  // hash the password
  userData.password = bcrypt.hashSync(userData.password);

  // Convert the user data into an user model object
  const user = Users.newUser(
    null,
    userData.firstName,
    userData.lastName,
    "member",
    userData.email,
    userData.password,
    userData.phone,
    userData.address,
    null
  );

  // Use the create model function to insert this user into the database
  Users.create(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Registration successful",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Registration failed",
        error: error,
      });
    });
});

//Get all
userController.get("/", auth(["manager", "trainer"]), async (req, res) => {
  const users = await Users.getAll();

  res.status(200).json({
    status: 200,
    message: "Get user list",
    users: users,
  });
});

//Get by ID
userController.get( "/:id", auth(["manager", "trainer", "member"]), async (req, res) => {
    const userID = req.params.id;
    const authenticationKey = req.get("X-AUTH-KEY");

    const currentUser = await Users.getByAuthenticationKey(authenticationKey);
    if (!currentUser) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorised",
        });
    }

      // Member role can only access their own account
    if (currentUser.role === "member" && userID !== currentUser.id) {
        return res.status(403).json({
            status: 403,
            message: "You do not have permission to access this user's account",
        });
    }
    
    Users.getUserByID(userID)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Get user by ID",
          user: user,
        });
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          message: "Failed to get user by ID",
        });
      });
  }
);

//Get username by ID
userController.get( "/name/:id", (req, res) => {
  const userID = req.params.id;
  
  Users.getUsernameByID(userID)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Get user name by ID",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get user name by ID",
      });
    });
}
);

//Get by role
userController.get("/role/:role", (req, res) => {
  const role = req.params.role;

  Users.getUsersByRole(role)
    .then((users) => {
      res.status(200).json({
        status: 200,
        message: "Get users by role",
        users: users,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get users by role",
        error: error,
      });
    });
});

//Get by authentication key
userController.get("/authentication/:authenticationKey", (req, res) => {
  const authenticationKey = req.params.authenticationKey;

  Users.getByAuthenticationKey(authenticationKey)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Get user by authentication key",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get user by authentication key",
      });
    });
});

//Post user
userController.post("/", auth(["manager", "trainer"]), (req, res) => {
  // Get the user data out of the request
  const userData = req.body.user;

  // Implement request validation
  if (!/^[a-zA-Z\-]+$/.test(userData.firstName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid first name",
    });
  }
  
  if (!/^[a-zA-Z\-]+$/.test(userData.lastName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid last name",
    });
  }
  
  if (!/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(userData.phone)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid phone number format",
    });
  }
  
  if (!/^[a-zA-Z0-9\s,',\/-]+$/.test(userData.address)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid address",
    });
  }
  
  
  if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(userData.email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
    });
  }
  
  if (!/[a-zA-Z0-9-]{6,}/.test(userData.password)) {
    return res.status(400).json({
      status: 400,
      message: "Password must be at least 6 characters and contain a variety of characters.",
    });
  }

  // hash the password if it isn't already hashed
  if (!userData.password.startsWith("$2a")) {
    userData.password = bcrypt.hashSync(userData.password);
  }

  // Convert the user data into an user model object
  const user = Users.newUser(
    null,
    userData.firstName,
    userData.lastName,
    userData.role,
    userData.email,
    userData.password,
    userData.phone,
    userData.address,
    null
  );

  // Use the create model function to insert this user into the database
  Users.create(user)
    .then((user) => {
      res.status(200).json({
        status: 200,
        message: "Created user successfully",
        user: user,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to create user",
      });
    });
});

//Patch user by ID
userController.patch("/:id", auth(["manager", "trainer", "member"]), async (req, res) => {
    // Get the user data out of the request
    const userID = req.params.id;
    const userData = req.body.user;
    const authenticationKey = req.get("X-AUTH-KEY");

    const currentUser = await Users.getByAuthenticationKey(authenticationKey);
    if (!currentUser) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorised",
        });
    }

    // member can only modify their own account
    if (currentUser.role === "member" && userID !== currentUser.id) {
        return res.status(403).json({
            status: 403,
            message: "You do not have permission to modify this user",
        });
    }

    // Use ID passed in URL
    userData.id = userID;

    // Implement request validation
  if (!/^[a-zA-Z\-]+$/.test(userData.firstName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid first name",
    });
  }
  
  if (!/^[a-zA-Z\-]+$/.test(userData.lastName)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid last name",
    });
  }
  
  if (!/(^\({0,1}((0|\+61)(2|4|3|7|8)){0,1}\){0,1}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{2}(\ |-){0,1}[0-9]{1}(\ |-){0,1}[0-9]{3}$)/.test(userData.phone)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid phone number format",
    });
  }
  
  if (!/^[a-zA-Z0-9\s,',\/-]+$/.test(userData.address)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid address",
    });
  }
  
  if (!/^\S{1,}@\S{1,}[.]\S{1,}$/.test(userData.email)) {
    return res.status(400).json({
      status: 400,
      message: "Invalid email format",
    });
  }
  
  if (!/[a-zA-Z0-9-]{6,}/.test(userData.password)) {
    return res.status(400).json({
      status: 400,
      message: "Password must be at least 6 characters and contain a variety of characters.",
    });
  }


    // hash the password if it isn't already hashed
    if (userData.password && !userData.password.startsWith("$2a")) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Convert the user data into a User model object
    const user = Users.newUser(
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.role,
      userData.email,
      userData.password,
      userData.phone,
      userData.address,
      userData.authenticationKey
    );

    // Use the update model function to update this user in the database
    Users.update(user)
      .then((user) => {
        res.status(200).json({
          status: 200,
          message: "Updated user successfully",
          user: user,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to update user",
        });
      });
  }
);

// XML upload
userController.post("/upload-xml", auth(["manager", "trainer"]), async (req, res) => {
  if (req.files && req.files["xml-file"]) {
    // Access the XML file as a string
    const XMLFile = req.files["xml-file"];
    const file_text = XMLFile.data.toString();

    // Set up XML parser
    const parser = new xml2js.Parser();
    try {
      const data = await parser.parseStringPromise(file_text);
      const userUpload = data["user-upload"];
      const userUploadAttributes = userUpload["$"];
      const operation = userUploadAttributes["operation"];
      const usersData = userUpload["users"][0]["user"];

      if (operation === "insert") {
        const emailCheckPromises = [];

        usersData.forEach((userData) => {
          const email = userData.email.toString();
          emailCheckPromises.push(Users.getByEmail(email)
            .then((result) => {
              return result;
            })
            .catch((error) => {
              return null;
            }));
        });

        Promise.all(emailCheckPromises)
          .then((results) => {
            // Check if any email already exists
            const duplicateEmail = results.find((result) => result !== null);
            if (duplicateEmail) {
              res.status(409).json({
                status: 409,
                message: "Email address already used with accounts.",
              });
            } else {
              const processPromises = usersData.map(async (userData) => {
                const userPassword = bcrypt.hashSync(userData.password.toString());

                const userModel = Users.newUser(
                  null,
                  userData.firstName.toString(),
                  userData.lastName.toString(),
                  userData.role.toString(),
                  userData.email.toString(),
                  userPassword,
                  userData.phone.toString(),
                  userData.address.toString(),
                  null
                );

                return Users.create(userModel);
              });

              Promise.all(processPromises)
                .then(() => {
                  res.status(200).json({
                    status: 200,
                    message: "XML Upload insert successful",
                  });
                })
                .catch((error) => {
                  res.status(500).json({
                    status: 500,
                    message: "XML upload failed on database operation: " + error,
                  });
                });
            }
          })
          .catch((error) => {
            res.status(500).json({
              status: 500,
              message: "Error checking email existence: " + error,
            });
          });
      } else {
        res.status(400).json({
          status: 400,
          message: "XML Contains invalid operation attribute value",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error parsing XML - " + error,
      });
    }
  } else {
    res.status(400).json({
      status: 400,
      message: "No file selected",
    });
  }
});

export default userController;




