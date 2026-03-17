import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import View from "./pages/View";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/view/:id",
				element: <View />,
			},
			{
				path: "/profile",
				element: <Profile />,
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
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}