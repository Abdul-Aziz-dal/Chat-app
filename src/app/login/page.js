"use client";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { makePostRequest } from "../components/makeRequest";
import { Router } from "next/router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const router = Router();
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      const params = {
        email,
        password,
      };

      const response = await makePostRequest(
        "/api/user-athentication/login",
        params
      );
      const { data, message } = response;
      if (data.length < 1) {
        throw new Error(message);
      }

      console.log("response front end ", data);
      // router.push("/chat-app");
      window.location.href = "/chat-app";
      setIsSubmitting(false);
    } catch (error) {
      alert(error.message);
      setIsSubmitting(false);
      console.log("Error ", error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 8,
          padding: 3,
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "background.paper",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
