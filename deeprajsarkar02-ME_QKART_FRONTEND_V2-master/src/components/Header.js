import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ButtonBase } from "@mui/material";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");

  let loggedIn = Boolean(username && token);

  function handleLogin() {
    history.push("/login");
  }
  function handleRegister() {
    history.push("/register");
  }

  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children && <Box className="header-children">{children}</Box>}
      {!hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      ) : loggedIn ? (
        <Stack direction="row" spacing={2}>
          <Avatar alt={username} src="/avatar.png" />
          <p className="username-text">{username}</p>
          <Button onClick={handleLogout}>LOGOUT</Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button onClick={handleLogin}>LOGIN</Button>
          <Button variant="contained" onClick={handleRegister}>REGISTER</Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
