import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SettingsIcon from "@mui/icons-material/Settings";
import "./navbar.css"; // Import du fichier CSS

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="navbar" sx={{ 
        backgroundColor: "#c18400", /* Applique l'orange ici directement */
      }}>
        <Toolbar className="toolbar">
          <div className="logo-container">
            <img className="logo" src="/logo.png" alt="Logo" />
            <span className="name">Atlas</span>
          </div>

          <div className="icons">
            <SettingsIcon />
            <AccountBoxIcon />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
