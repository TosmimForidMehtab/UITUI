import { useState, useEffect } from "react";
import axios from "axios";
import {
	Container,
	Typography,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Box,
	Paper,
	Avatar,
} from "@mui/material";
import {
	AccountBalanceWallet,
	CalendarToday,
	CurrencyRupee,
	TrendingUp,
	Description,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const host = import.meta.env.VITE_API_URL;

const Portfolio = () => {
	const [portfolio, setPortfolio] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		const fetchPortfolio = async () => {
			try {
				const response = await axios.get(`${host}/portfolios`, {
					headers: { Authorization: `Bearer ${user.token}` },
				});
				if (response.data.success && response.data.data.length > 0) {
					setPortfolio(response.data.data[0]);
				}
			} catch (err) {
				setError("An error occurred while fetching the portfolio");
				console.error("Error fetching portfolio:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchPortfolio();
	}, [user.token]);

	if (loading) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<Typography color="error">
					{error || "No portfolio found"}
				</Typography>
			</Box>
		);
	}

	return (
		<>
			{portfolio ? (
				<Box className="min-h-screen py-4 sm:px-6 lg:px-8">
					<Container maxWidth="lg">
						<Typography
							variant="h3"
							component="h1"
							gutterBottom
							className="text-center text-gray-800"
						>
							Portfolio
						</Typography>
						<Paper
							elevation={3}
							className="p-6 md:p-12 bg-white rounded-xl shadow-xl"
						>
							<Grid container spacing={6}>
								<Grid item xs={12} md={6}>
									<Card className="h-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
										<CardContent className="h-full flex flex-col justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white">
											<Box>
												<Box className="flex items-center mb-4">
													<img
														src={
															portfolio.plan.logo
														}
														alt={
															portfolio.plan.name
														}
														className="w-14 h-14 rounded-full mr-2"
													/>
													<Typography
														variant="h4"
														component="h2"
													>
														{portfolio.plan.name}
													</Typography>
												</Box>
												<Typography
													variant="body1"
													className="mb-6"
												>
													{portfolio.plan.description}
												</Typography>
											</Box>
											<div className="flex justify-between items-center">
												<Typography variant="h5">
													₹
													{portfolio.amount.toFixed(
														2
													)}
												</Typography>
												<Typography
													variant="h6"
													className="bg-white text-blue-600 px-3 py-1 rounded-full flex justify-center items-center gap-2"
												>
													{portfolio.status ===
													"ACTIVE" ? (
														<div className="w-2 h-2 rounded-full bg-green-500 animate-ping  "></div>
													) : (
														<></>
													)}
													{portfolio.status}{" "}
												</Typography>
											</div>
										</CardContent>
									</Card>
								</Grid>
								<Grid item xs={12} md={6}>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
										<InfoCard
											icon={
												<CalendarToday className="text-blue-500" />
											}
											title="Investment Date"
											value={new Date(
												portfolio.dateOfInvestment
											).toLocaleDateString()}
										/>
										<InfoCard
											icon={
												<AccountBalanceWallet className="text-green-500" />
											}
											title="Invested Amount"
											value={`₹${portfolio.amount.toFixed(
												2
											)}`}
										/>
										<InfoCard
											icon={
												<CurrencyRupee className="text-yellow-500" />
											}
											title="Today's Earning"
											value={`₹${portfolio.todayEarning.toFixed(
												2
											)}`}
										/>
										<InfoCard
											icon={
												<TrendingUp className="text-purple-500" />
											}
											title="Total Earning"
											value={`₹${portfolio.totalEarning.toFixed(
												2
											)}`}
										/>
									</div>
								</Grid>
							</Grid>
							<Box className="mt-8">
								<Typography
									variant="h5"
									gutterBottom
									className="flex items-center"
								>
									<Description className="mr-2" /> Plan
									Details
								</Typography>
								<Grid container spacing={4} className="mt-2">
									<Grid item xs={12} sm={6} md={3}>
										<DetailItem
											title="Duration"
											value={`${portfolio.plan.duration} days`}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<DetailItem
											title="Price"
											value={`₹${portfolio.plan.price.toFixed(
												2
											)}`}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<DetailItem
											title="Return %"
											value={`${portfolio.plan.returnPercentage}%`}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<DetailItem
											title="Total Return"
											value={`₹${portfolio.plan.totalReturnAmount.toFixed(
												2
											)}`}
											highlight={true}
										/>
									</Grid>
								</Grid>
							</Box>
						</Paper>
					</Container>
				</Box>
			) : (
				<Box className="flex justify-center items-center h-screen">
					<Typography
						variant="h3"
						align="center"
						className="text-gray-800 px-4"
					>
						No Portfolio Found
					</Typography>
				</Box>
			)}
		</>
	);
};

const InfoCard = ({ icon, title, value }) => (
	<Card className="h-full">
		<CardContent className="border border-cyan-500">
			<div className="flex items-center mb-2">
				{icon}
				<Typography variant="h6" component="h3" className="ml-2">
					{title}
				</Typography>
			</div>
			<Typography variant="h5" component="p" className="font-bold">
				{value}
			</Typography>
		</CardContent>
	</Card>
);

const DetailItem = ({ title, value, highlight = false }) => (
	<div
		className={`p-4 rounded-lg ${
			highlight
				? "bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-md transform hover:scale-105 transition-all duration-300"
				: ""
		}`}
	>
		<Typography
			variant="subtitle2"
			color="textSecondary"
			className={highlight ? "text-yellow-800" : ""}
		>
			{title}
		</Typography>
		<Typography
			variant="h5"
			className={`font-bold ${highlight ? "text-yellow-900" : ""}`}
		>
			{value}
		</Typography>
	</div>
);

export default Portfolio;
