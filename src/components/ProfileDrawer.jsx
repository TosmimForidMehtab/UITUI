import React from "react";
import {
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import {
	Person,
	AccountBalanceWallet,
	ExitToApp,
	Payment,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const ProfileDrawer = ({ onClose, logout }) => {
	return (
		<div className="w-64">
			<List>
				<ListItem
					button
					component={Link}
					to="/profile"
					onClick={onClose}
				>
					<ListItemIcon>
						<Person />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</ListItem>
				<ListItem
					button
					component={Link}
					to="/wallet"
					onClick={onClose}
				>
					<ListItemIcon>
						<AccountBalanceWallet />
					</ListItemIcon>
					<ListItemText primary="Wallet" />
				</ListItem>
				<ListItem
					button
					component={Link}
					to="/portfolio"
					onClick={onClose}
				>
					<ListItemIcon>
						<Payment />
					</ListItemIcon>
					<ListItemText primary="Portfolio" />
				</ListItem>
				<Divider />
				<ListItem button onClick={logout} className="cursor-pointer">
					<ListItemIcon>
						<ExitToApp />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItem>
			</List>
		</div>
	);
};

export default ProfileDrawer;
