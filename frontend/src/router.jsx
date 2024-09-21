import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./common/RestrictedRoute";
import TimetablePage from "./features/classes/TimetablePage";
import BookingsPage from "./features/bookings/BookingsPage";
import CreateBookingPage from "./features/bookings/CreateBookingPage";
import ProfilePage from "./features/users/ProfilePage";
import ImportPage from "./features/xml/ImportPage";
import BlogPostsPage from "./features/blogposts/BlogpostsPage";
import HomePage from "./features/main/HomePage";
import UserPage from "./features/users/UserPage";
import PostDetailsPage from "./features/blogposts/BlogpostDetailsPage";
import GymPage from "./features/main/GymPage";
import ImportListPage from "./features/xml/ImportListPage";
import LoginPage from "./features/users/LoginPage";
import RegisterPage from "./features/users/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/timetable",
    element: <TimetablePage />,
  },
  {
    path: "/bookings",
    element: (
      <RestrictedRoute allowedRoles={["member"]}>
        <BookingsPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/classes/:activity_id/:URLdate/:time",
    element: (
      <RestrictedRoute allowedRoles={["member"]}>
        <CreateBookingPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <RestrictedRoute allowedRoles={["member", "trainer"]}>
        <ProfilePage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/blogs",
    element: <BlogPostsPage />,
  },
  {
    path: "/blogs/:blogpostID",
    element: <PostDetailsPage />,
  },
  {
    path: "/import",
    element: (
      <RestrictedRoute allowedRoles={["manager", "trainer"]}>
        <ImportPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/importlists",
    element: (
      <RestrictedRoute allowedRoles={["manager", "trainer"]}>
        <ImportListPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <RestrictedRoute allowedRoles={["manager"]}>
        <UserPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/gym",
    element: (
      <RestrictedRoute allowedRoles={["manager"]}>
        <GymPage />
      </RestrictedRoute>
    ),
  },
]);

export default router;
