import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Drawer, Avatar, Button } from "@mui/material";
import ProfileDrawer from "./ProfileDrawer";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
	const { user, logout } = useAuth();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const location = useLocation();

	const toggleDrawer = (open) => (event) => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}
		setDrawerOpen(open);
	};

	const handleLogout = async () => {
		setDrawerOpen(false);
		await logout();
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-gray-200 shadow-sm sticky top-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<Link
								to="/"
								className="flex-shrink-0 flex items-center"
							>
								<div className="rounded-full border-2 border-white shadow p-2">
									<h3 className="text-2xl font-bold text-indigo-600">
										UIT
									</h3>
								</div>
							</Link>
						</div>
						<div className="flex items-center gap-10">
							{user ? (
								<>
									<Avatar
										className="cursor-pointer"
										onClick={toggleDrawer(true)}
									>
										{user?.email &&
											user?.email[0]?.toUpperCase()}
									</Avatar>
								</>
							) : (
								<>
									<Link
										to="/signin"
										className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
									>
										Sign In
									</Link>
									<Link
										to="/signup"
										className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
									>
										Sign Up
									</Link>
								</>
							)}
						</div>
					</div>
				</div>
			</nav>
			<main className="max-w-7xl mx-auto px-4 sm:px-0">{children}</main>
			<Drawer
				anchor="right"
				open={drawerOpen}
				onClose={toggleDrawer(false)}
			>
				<ProfileDrawer
					onClose={toggleDrawer(false)}
					logout={handleLogout}
				/>
			</Drawer>
		</div>
	);
};

export default Layout;
