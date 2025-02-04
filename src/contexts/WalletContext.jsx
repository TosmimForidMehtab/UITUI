import axios from "axios";
import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "react-toastify";

const WalletContext = createContext();
const host = import.meta.env.VITE_API_URL;

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
	const [balance, setBalance] = useState(0);
	const [prefilledAmounts, setPrefilledAmounts] = useState([]);
	const [upiId, setUpiId] = useState([]);

	const fetchWallet = async () => {
		const response = await axios.get(`${host}/wallet`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		const { data } = response.data;
		setBalance(data?.wallet?.balance || 0);
		setPrefilledAmounts(
			data?.denominations
				?.map((denomination) => denomination?.amount)
				?.sort((a, b) => a - b) || []
		);
		setUpiId(data?.upis?.map((upi) => upi?.upiId) || []);
	};

	const deposit = useCallback(async (amount, transactionId) => {
		try {
			if (amount > 0) {
				const response = await axios.post(
					`${host}/transactions`,
					{ amount, transactionId },
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem(
								"token"
							)}`,
						},
					}
				);
				const { data } = response.data;
				return {
					success: true,
					message: `Successfully requested for deposit $${amount}. Transaction ID: ${transactionId}`,
				};
			}
		} catch (error) {
			return { success: false, message: "Invalid deposit amount" };
		}
	}, []);

	const withdraw = useCallback(
		async (amount) => {
			try {
				if (amount > 0 && Number(amount) <= Number(balance / 2)) {
					const response = await axios.post(
						`${host}/transactions`,
						{ amount, type: "WITHDRAWAL" },
						{
							headers: {
								Authorization: `Bearer ${localStorage.getItem(
									"token"
								)}`,
							},
						}
					);
					return {
						success: true,
						message: `Successfully requested for withdrawal for $${amount}`,
					};
				}
			} catch (error) {
				return {
					success: false,
					message:
						amount > balance
							? "Insufficient funds"
							: "Invalid withdrawal amount",
				};
			}
		},
		[balance]
	);

	return (
		<WalletContext.Provider
			value={{
				balance,
				fetchWallet,
				deposit,
				withdraw,
				prefilledAmounts,
				upiId,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};
