import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./components/Profile";
import Wallet from "./components/Wallet";
import { WalletProvider } from "./contexts/WalletContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!user || (adminOnly && user.role !== "USER")) {
		return <Navigate to="/signin" replace />;
	}

	return children;
};

const App = () => {
	return (
		<AuthProvider>
			<WalletProvider>
				<Router>
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/signin" element={<SignIn />} />
							<Route path="/signup" element={<SignUp />} />
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>

							<Route
								path="/wallet"
								element={
									<ProtectedRoute>
										<Wallet />
									</ProtectedRoute>
								}
							/>
						</Routes>
					</Layout>
				</Router>
				<ToastContainer
					position="top-center"
					autoClose={3000}
					hideProgressBar={false}
				/>
			</WalletProvider>
		</AuthProvider>
	);
};

export default App;
