import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
	const [balance, setBalance] = useState(0);

	const fetchBalance = useCallback(async () => {
		setBalance(1000.0);
	}, []);

	const deposit = useCallback(async (amount, transactionId) => {
		if (amount > 0) {
			setBalance((prevBalance) => prevBalance + amount);
			return {
				success: true,
				message: `Successfully deposited $${amount}. Transaction ID: ${transactionId}`,
			};
		}
		return { success: false, message: "Invalid deposit amount" };
	}, []);

	const withdraw = useCallback(
		async (amount) => {
			if (amount > 0 && amount <= balance) {
				setBalance((prevBalance) => prevBalance - amount);
				return {
					success: true,
					message: `Successfully withdrew $${amount}`,
				};
			}
			return {
				success: false,
				message:
					amount > balance
						? "Insufficient funds"
						: "Invalid withdrawal amount",
			};
		},
		[balance]
	);

	return (
		<WalletContext.Provider
			value={{ balance, fetchBalance, deposit, withdraw }}
		>
			{children}
		</WalletContext.Provider>
	);
};
