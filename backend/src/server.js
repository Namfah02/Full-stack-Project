import express from "express"
import activityController from "./controllers/activities.js"
import blogPostController from "./controllers/blogposts.js"
import bookingController from "./controllers/bookings.js"
import classController from "./controllers/classes.js"
import locationController from "./controllers/locations.js"
import userController from "./controllers/users.js"
import cors from "cors"
import fileUpload from "express-fileupload"

// Create express application
const port = 8080
const app = express()

// Enable cross-origin resources sharing (CORS)
app.use(cors({
    origin: true,
}))

// Enable JSON request parsing middleware. Must be done before endpoints are defined.
//
// If a request with a `Content-Type: application/json` header is made to a route, this middleware will treat the request body as a JSON string. 
//It will attempt to parse it with `JSON.parse()` and set the resulting object (or array) on a `body` property of the request object, 
//which you can access in your route endpoints, or other general middleware.
app.use(express.json())

// Enable file upload support
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))


// Import and use the route defined by controller
app.use("/activities", activityController)
app.use("/blogs", blogPostController)
app.use("/bookings", bookingController)
app.use("/classes", classController)
app.use("/locations", locationController)
app.use("/users", userController)


// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
})

// Listening for API requests
app.listen(
    port,
    () => console.log(`Express started on http://localhost:${port}`),
)
