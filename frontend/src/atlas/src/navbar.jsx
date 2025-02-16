import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import "./navbar.css";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        className="navbar"
        sx={{
          backgroundColor: "#c18400",
        }}
      >
        <Toolbar className="toolbar">
          <Link to="/" className="icon-link">
            <div className="logo-container">
              <img className="logo" src="/logo.png" alt="Logo" />
              <span className="name">Atlas</span>
            </div>
          </Link>
          <div className="icons">
            <Link to="/parameter" className="icon-link">
              <SettingsIcon />
            </Link>
            <AccountBoxIcon />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
