import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
	Button,
	Card,
	CardContent,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Box,
	Chip,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const host = import.meta.env.VITE_API_URL;

const PlanCard = ({ plan, onChoosePlan, isPopular, activePlan }) => (
	<motion.div
		whileHover={{ scale: 1.05 }}
		transition={{ type: "spring", stiffness: 100 }}
		className="w-full"
	>
		<Card
			className={`flex flex-col h-full shadow-lg rounded-lg overflow-hidden ${
				isPopular ? "border-2 border-indigo-500" : ""
			}`}
			elevation={isPopular ? 8 : 2}
		>
			<CardContent className="flex-grow flex flex-col justify-between p-6">
				<div>
					<div className="w-20 h-20 mx-auto mb-4">
						<img
							src={plan.logo || "/placeholder.svg"}
							alt={plan.name}
							className="w-full h-full object-cover rounded-full"
						/>
					</div>
					<Typography
						variant="h4"
						component="h2"
						className="font-bold text-center mb-4"
					>
						{plan.name}
					</Typography>
					<Typography
						variant="h3"
						component="p"
						className="text-center mb-4 text-indigo-600"
					>
						₹{plan.price}
						<Typography
							variant="subtitle1"
							component="span"
							className="text-gray-500"
						>
							/{plan.duration} days
						</Typography>
					</Typography>
					<Typography
						variant="body1"
						className="text-center mb-6 text-gray-600"
					>
						{plan.description}
					</Typography>
					<div className="space-y-2 mb-6">
						<div className="flex justify-between">
							<span>Return Percentage:</span>
							<span className="font-semibold">
								{plan.returnPercentage}%
							</span>
						</div>
						<div className="flex justify-between">
							<span>Total Return Amount:</span>
							<span className="font-semibold">
								₹
								{plan.totalReturnAmount ||
									Number(plan.price * plan.returnPercentage) /
										100 +
										Number(plan.price)}
							</span>
						</div>
					</div>
				</div>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					size="large"
					className="bg-indigo-600 hover:bg-indigo-700 py-3 text-lg font-semibold"
					onClick={() => onChoosePlan(plan._id)}
					disabled={activePlan?.plan?._id === plan._id}
				>
					{activePlan?.plan?._id === plan._id
						? "Active"
						: "Choose Plan"}
				</Button>
			</CardContent>
		</Card>
	</motion.div>
);

export default function Plans() {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedPlanId, setSelectedPlanId] = useState(null);
	const [activePlan, setActivePlan] = useState(null);
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const res = await axios.get(`${host}/plans`);
				setPlans(res?.data?.data?.plans);
			} catch (err) {
				setError("Failed to load plans. Please try again later.");
			} finally {
				setLoading(false);
			}
		};

		fetchPlans();
	}, []);

	useEffect(() => {
		const checkActivePlan = async () => {
			if (user) {
				try {
					const res = await axios.get(`${host}/plans/active`, {
						headers: { Authorization: `Bearer ${user.token}` },
					});
					setActivePlan(res.data.data);
				} catch (err) {
					console.error("Error checking active plan:", err);
				}
			}
		};

		checkActivePlan();
	}, [user]);

	const handleChoosePlan = async (planId) => {
		if (!user) {
			toast.error("Please log in to choose a plan.");
			navigate("/signin");
			return;
		}

		setSelectedPlanId(planId);

		if (activePlan && activePlan.remainingDays > 0) {
			setOpenDialog(true);
		} else {
			await activatePlan(planId);
		}
	};

	const activatePlan = async (planId) => {
		try {
			await axios.post(
				`${host}/plans/activate/${planId}`,
				{},
				{
					headers: { Authorization: `Bearer ${user.token}` },
				}
			);
			toast.success("Plan activated successfully!");
		} catch (err) {
			toast.error("Failed to activate plan.");
		}
	};

	const handleConfirmActivation = async () => {
		setOpenDialog(false);
		await activatePlan(selectedPlanId);
	};

	if (loading) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<Typography variant="h5" className="text-gray-600">
					Loading plans...
				</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="flex justify-center items-center h-screen">
				<Typography variant="h5" className="text-red-500">
					{error}
				</Typography>
			</Box>
		);
	}

	return (
		<Box className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
			<Typography
				variant="h2"
				component="h1"
				className="font-bold text-center mb-4 text-indigo-800"
			>
				Choose Your Plan
			</Typography>
			<Typography
				variant="h5"
				component="p"
				className="text-center mb-12 text-gray-600"
			>
				Select the perfect plan for your needs
			</Typography>
			<Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
				{plans.map((plan, index) => (
					<PlanCard
						key={plan._id}
						plan={plan}
						onChoosePlan={handleChoosePlan}
						isPopular={index === 1}
						activePlan={user && activePlan}
					/>
				))}
			</Box>
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Confirm Plan Change"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You already have an active plan with{" "}
						<span className="text-xl font-semibold">
							{activePlan?.remainingDays}
						</span>{" "}
						days remaining. Are you sure you want to switch to a new
						plan? Your current plan will be replaced.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenDialog(false)}
						color="error"
						variant="contained"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmActivation}
						color="info"
						autoFocus
						variant="contained"
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
