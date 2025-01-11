import React, { useState, useEffect } from "react";
import {
	Tabs,
	Tab,
	Box,
	Typography,
	Paper,
	Button,
	TextField,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { useWallet } from "../contexts/WalletContext";
import { toast } from "react-toastify";

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={3}>{children}</Box>}
		</div>
	);
};

const AmountSelector = ({
	prefilledAmounts,
	selectedAmount,
	onAmountChange,
	onCustomAmountChange,
}) => {
	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				{prefilledAmounts.map((amount) => (
					<Button
						key={amount}
						variant={
							selectedAmount === amount ? "contained" : "outlined"
						}
						onClick={() => onAmountChange(amount)}
						className="w-full"
					>
						₹{amount}
					</Button>
				))}
			</div>
			<TextField
				fullWidth
				label="Custom Amount"
				type="number"
				InputProps={{ inputProps: { min: 0, step: 0.01 } }}
				onChange={(e) =>
					onCustomAmountChange(parseFloat(e.target.value))
				}
			/>
		</div>
	);
};

const DepositModal = ({ open, onClose, amount, onDeposit }) => {
	const [transactionId, setTransactionId] = useState("");

	const handleDeposit = () => {
		onDeposit(transactionId);
		setTransactionId("");
		toast.success("Deposit request sent");
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Deposit Confirmation</DialogTitle>
			<DialogContent>
				<div className="space-y-4 mt-4">
					<TextField
						fullWidth
						label="Deposit Amount"
						value={`
₹${amount.toFixed(2)}`}
						InputProps={{ readOnly: true }}
					/>
					<TextField
						fullWidth
						label="Transaction ID"
						value={transactionId}
						onChange={(e) => setTransactionId(e.target.value)}
						placeholder="Enter transaction ID"
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleDeposit}
					variant="contained"
					color="primary"
					disabled={!transactionId}
				>
					Request for Deposit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const WithdrawModal = ({ open, onClose, amount, onWithdraw }) => {
	const handleWithdraw = () => {
		onWithdraw();
		toast.success("Withdrawal request sent!");
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Withdraw Confirmation</DialogTitle>
			<DialogContent>
				<div className="space-y-4 mt-4">
					<TextField
						fullWidth
						label="Withdraw Amount"
						value={`
₹${amount.toFixed(2)}`}
						InputProps={{ readOnly: true }}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleWithdraw}
					variant="contained"
					color="primary"
				>
					Request for Withdrawal
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const Wallet = () => {
	const [tabValue, setTabValue] = useState(0);
	const { balance, fetchBalance, deposit, withdraw } = useWallet();
	const [depositAmount, setDepositAmount] = useState(0);
	const [withdrawAmount, setWithdrawAmount] = useState(0);
	const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

	useEffect(() => {
		fetchBalance();
	}, [fetchBalance]);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleDepositRequest = () => {
		setIsDepositModalOpen(true);
	};

	const handleDeposit = (transactionId) => {
		if (depositAmount > 0) {
			deposit(depositAmount, transactionId);
			setDepositAmount(0);
			setIsDepositModalOpen(false);
		}
	};

	const handleWithdrawRequest = () => {
		setIsWithdrawModalOpen(true);
	};

	const handleWithdraw = () => {
		if (withdrawAmount > 0 && withdrawAmount <= balance) {
			withdraw(withdrawAmount);
			setWithdrawAmount(0);
			setIsWithdrawModalOpen(false);
		}
	};
	const handleCopy = (e) => {
		try {
			const upi = "test@ok.test";
			navigator.clipboard.writeText(upi);
			toast.success("Copied successfully");
		} catch (error) {
			toast.error("Something went wrong!");
		}
	};

	const prefilledAmounts = [100, 500, 1000, 2000];

	return (
		<div className="max-w-2xl mx-auto mt-8">
			<h2 className="text-2xl font-bold mb-4 text-center uppercase">
				Wallet
			</h2>
			<Paper elevation={3} className="mb-4 p-4">
				<Typography
					variant="h6"
					component="div"
					className="text-center"
				>
					Current Balance
				</Typography>
				<Typography
					variant="h4"
					component="div"
					className="text-center font-bold text-indigo-600"
				>
					₹{balance.toFixed(2)}
				</Typography>
			</Paper>
			<Box className="p-4 bg-gray-100 rounded-lg shadow-md flex items-center justify-between space-x-4">
				<h2 className="text-lg font-semibold italic text-gray-700">
					UPI: <span className="text-indigo-600">test@ok.test</span>
				</h2>
				<button
					className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
					onClick={handleCopy}
				>
					Copy UPI
				</button>
			</Box>

			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					aria-label="wallet tabs"
				>
					<Tab
						label="Deposit"
						id="simple-tab-0"
						aria-controls="simple-tabpanel-0"
					/>
					<Tab
						label="Withdraw"
						id="simple-tab-1"
						aria-controls="simple-tabpanel-1"
					/>
				</Tabs>
			</Box>
			<TabPanel value={tabValue} index={0}>
				<AmountSelector
					prefilledAmounts={prefilledAmounts}
					selectedAmount={depositAmount}
					onAmountChange={setDepositAmount}
					onCustomAmountChange={setDepositAmount}
				/>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					onClick={handleDepositRequest}
					sx={{
						marginTop: 2,
					}}
					disabled={depositAmount <= 0 || isNaN(depositAmount)}
				>
					Deposit ₹{isNaN(depositAmount) ? 0 : depositAmount}
				</Button>
			</TabPanel>
			<TabPanel value={tabValue} index={1}>
				<AmountSelector
					prefilledAmounts={prefilledAmounts}
					selectedAmount={withdrawAmount}
					onAmountChange={setWithdrawAmount}
					onCustomAmountChange={setWithdrawAmount}
				/>
				<Button
					variant="contained"
					color="primary"
					fullWidth
					onClick={handleWithdrawRequest}
					sx={{
						marginTop: 2,
					}}
					disabled={
						withdrawAmount <= 0 ||
						withdrawAmount > balance ||
						isNaN(withdrawAmount)
					}
				>
					Withdraw ₹{isNaN(withdrawAmount) ? 0 : withdrawAmount}
				</Button>
			</TabPanel>
			<DepositModal
				open={isDepositModalOpen}
				onClose={() => setIsDepositModalOpen(false)}
				amount={depositAmount}
				onDeposit={handleDeposit}
			/>

			<WithdrawModal
				open={isWithdrawModalOpen}
				onClose={() => setIsWithdrawModalOpen(false)}
				amount={withdrawAmount}
				onWithdraw={handleWithdraw}
			/>
		</div>
	);
};

export default Wallet;
