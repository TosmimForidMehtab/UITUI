import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
	Card,
	CardContent,
	CardHeader,
	Typography,
	Button,
	TextField,
	Snackbar,
	CircularProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const host = import.meta.env.VITE_API_URL;

const Profile = () => {
	const { user } = useAuth();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [planDetails, setPlanDetails] = useState(null);
	const [referralData, setReferralData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [planResponse, referralResponse] = await Promise.all([
					axios.get(`${host}/plans/active`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}),
					axios.get(`${host}/users/ref`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}),
				]);
				setPlanDetails(planResponse?.data?.data);
				setReferralData(referralResponse?.data?.data);
			} catch (err) {
				setError("Failed to fetch data. Please try again later.");
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(() => {
			setOpenSnackbar(true);
		});
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<CircularProgress />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-500 mt-8">
				<Typography variant="h6">{error}</Typography>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto mt-8 space-y-6 p-4">
			<Typography
				variant="h4"
				className="text-center uppercase font-bold mb-4"
			>
				Profile
			</Typography>

			<Card className="mb-6">
				<CardHeader title="User Information" />
				<CardContent>
					<Typography variant="body1">
						<span className="font-semibold">Email:</span>{" "}
						{user?.email}
					</Typography>
				</CardContent>
			</Card>

			{planDetails && (
				<Card className="mb-6">
					<CardHeader title="Active Plan Details" />
					<CardContent>
						{!planDetails?.plan?.name ? (
							<div>No Active Plans</div>
						) : (
							<div className="space-y-2">
								<Typography variant="body1">
									<span className="font-semibold">
										Plan Name:
									</span>{" "}
									{planDetails.plan.name}
								</Typography>
								<Typography variant="body1">
									<span className="font-semibold">
										Price:
									</span>{" "}
									₹{planDetails.plan.price}/
									{planDetails.plan.duration}
								</Typography>
								<Typography variant="body1">
									<span className="font-semibold">
										Description:
									</span>{" "}
									{planDetails.plan.description}
								</Typography>
								<Typography variant="body1">
									<span className="font-semibold">
										Duration:
									</span>{" "}
									{planDetails.plan.duration} month(s)
								</Typography>
								<Typography variant="body1">
									<span className="font-semibold">
										Remaining Days:
									</span>{" "}
									{planDetails.remainingDays}
								</Typography>
							</div>
						)}
					</CardContent>
				</Card>
			)}

			{referralData && (
				<Card>
					<CardHeader title="Referral Details" />
					<CardContent>
						<div className="space-y-4">
							<div>
								<Typography
									variant="body1"
									className="font-semibold mb-2"
								>
									Your Referral Code:
								</Typography>
								<div className="flex space-x-2">
									<TextField
										value={referralData.referCode}
										InputProps={{ readOnly: true }}
										fullWidth
									/>
									<Button
										variant="contained"
										startIcon={<ContentCopyIcon />}
										onClick={() =>
											copyToClipboard(
												referralData.referCode
											)
										}
									>
										Copy
									</Button>
								</div>
							</div>
							<div>
								<Typography
									variant="body1"
									className="font-semibold mb-2"
								>
									Your Referral URL:
								</Typography>
								<div className="flex space-x-2">
									<TextField
										value={referralData.referralUrl}
										InputProps={{ readOnly: true }}
										fullWidth
									/>
									<Button
										variant="contained"
										startIcon={<ContentCopyIcon />}
										onClick={() =>
											copyToClipboard(
												referralData.referralUrl
											)
										}
									>
										Copy
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={() => setOpenSnackbar(false)}
				message="Copied to clipboard!"
			/>
		</div>
	);
};

export default Profile;
