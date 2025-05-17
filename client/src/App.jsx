import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import AgentPage from "./routes/agentPage/AgentPage";
import AgentDetailPage from "./routes/agentDetailPage/AgentDetailPage";
import VerifyEmail from "./routes/verifyEmail/VerifyEmail";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminPosts from "./Pages/admin/AdminPosts";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminSignup from "./routes/adminRegister/AdminSignup";
import AdminLogin from "./routes/adminLogin/AdminLogin";
//import SubscriptionPage from "./routes/subscriptionPage/SubscriptionPage.jsx";
//import SubscribePage from "./routes/subscriptionPage/SubscribePage.jsx";
import SubscriptionPage from "./routes/subscriptionPage/SubscriptionPage.jsx";
import DevPlansPage from "./routes/dev/DevPlansPage";

import MySubscriptionPage from "./routes/MySubscriptionPage/MySubscriptionPage.jsx";
import CancelPage from "./routes/cancel/CancelPage";
import SuccessPage from "./routes/success/SuccessPage.jsx"; 

import { Navigate } from "react-router-dom";
import { subscriptionPlansLoader } from "./lib/loaders";


import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
  agentPageLoader,
  agentDetailPageLoader,
} from "./lib/loaders";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/verify-email",
          element: <VerifyEmail />,
        },
        {
          path: "/post/:id",
          element: <SinglePage />,
          loader: singlePageLoader, 
          errorElement: <p>Error loading post!</p>,
        },

        {
          path: "/edit/:id",
          element: <NewPostPage />, 
        },
        

        {
          path: "/agents",
          element: <AgentPage />,
          loader: agentPageLoader,
        },
        {
          path: "/agents/:id",
          element: <AgentDetailPage />,
          loader: agentDetailPageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },

    {
      path: "/my-subscription",
      element: <MySubscriptionPage />,
    },
    {
      path: "/dev/plans",
      element: <DevPlansPage />,
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "subscribe",
          element: <SubscriptionPage />,
          loader: subscriptionPlansLoader,
        },
        
        {
          path: "",
          element: <Navigate to="subscribe" />, 
        },
      ],
    },
    {
      path: "/cancel",
      element: <CancelPage />,
    },
    {
      path: "/success",
      element: <SuccessPage/>
    },
    
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "/edit/:id",
          element: <NewPostPage />,
        },
      ],
    },
    {
      path: "/admin-register",
      element: <AdminSignup />,
    },
    {
      path: "/admin-login",
      element: <AdminLogin />,
    },

    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "posts",
          element: <AdminPosts />,
        },
        {
          path: "users",
          element: <AdminUsers />,
        },
      ],
    },
    
  ]);

  return <RouterProvider router={router} />;
}

export default App;
