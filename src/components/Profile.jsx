import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
	const { user } = useAuth();
	return (
		<div className="max-w-2xl mx-auto mt-8">
			<h2 className="text-2xl font-bold mb-4 text-center uppercase">
				Profile
			</h2>
			<div className="bg-white shadow-md rounded-lg p-6 text-black">
				<p className="text-lg">
					<span className="font-semibold">Email:</span> {user?.email}
				</p>
				{/* Add more user information here */}
			</div>
		</div>
	);
};

export default Profile;
