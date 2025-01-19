"use client";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { makePostRequest } from "../components/makeRequest";
import Cookies from "js-cookie";

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [userData, setUserData] = useState("");
  const [selectedUserData, setSelectedUserData] = useState({});

  useEffect(() => {
    const userDataCookie = Cookies.get("userData");
    setUserData(JSON.parse(userDataCookie) || {});
  }, []);

  useEffect(() => {
    if (userData) {
      getUsers();
    }
  }, [userData]);

  useEffect(() => {
    if (!userData) return;
    const socketClient = io(); // Connect to the server
    socketClient.emit("register_user", userData.user_id); // Register the logged-in user on the server
    setSocket(socketClient);

    // Listen for messages
    socketClient.on("receive-message", (data) => {
      if (data.senderID != userData.user_id)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            sender: data.senderID === userData.user_id ? "You" : data.userName,
          },
        ]);
    });

    return () => {
      socketClient.disconnect(); // Disconnect when the component unmounts
    };
  }, [userData]);

  const getUsers = async () => {
    const users = await makePostRequest("api/get-users");
    const { data = [], messages } = users;
    const skipLoginedUserData = data.filter(
      (user) => user.user_id !== userData.user_id
    );
    setContacts((preUsers) => [...preUsers, ...skipLoginedUserData]);
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== "" && selectedUserData.user_id) {
      const messageTime = new Date().toLocaleTimeString();
      const messageData = {
        text: inputMessage,
        userId: userData.user_id,
        userName: userData.user_name,
        time: messageTime,
        senderID: userData.user_id,
        receiverID: selectedUserData.user_id,
      };

      socket.emit("message", messageData); // Send the message to the server
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "You",
          ...messageData,
        },
      ]);

      setInputMessage("");
    } else {
      alert("Please select a contact before sending a message.");
    }
  };

  const contactSelectHandler = (selectedUser) => {
    setSelectedUserData(selectedUser); // Set the selected contact
  };

  return (
    <Box display={"flex"} justifyContent={"center"} gap={1}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        flex={2 / 7}
        sx={{
          backgroundColor: "#f0f2f5",
          padding: "24px",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#075e54",
            fontWeight: "bold",
          }}
        >
          Contacts
        </Typography>

        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            height: "350px",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#ffffff",
          }}
        >
          <List>
            {contacts.map((user, index) => (
              <Box
                key={index}
                display={"flex"}
                onClick={() => contactSelectHandler(user)}
                p={1}
                sx={{
                  borderBottom: "1px solid #ddd",
                  "&:hover": {
                    backgroundColor: "#e9edef",
                  },
                }}
              >
                <ListItem>{user.user_name}</ListItem>
                <ListItem>
                  {user.online_status === 1 ? "online" : "offline"}
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        flex={1 / 2}
        sx={{
          backgroundColor: "#f0f2f5",
          padding: "24px",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#075e54",
            fontWeight: "bold",
          }}
        >
          Chat App
        </Typography>

        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            height: "350px",
            overflowY: "auto",
            padding: "10px",
            backgroundColor: "#e5ddd5",
          }}
        >
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "You" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: msg.sender === "You" ? "#dcf8c6" : "#fff",
                    padding: "10px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="caption">{msg.userName}</Typography>
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{ textAlign: "right", display: "block" }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
              },
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={sendMessage}
            sx={{
              marginLeft: "10px",
              borderRadius: "25px",
              backgroundColor: "#25d366",
              "&:hover": {
                backgroundColor: "#128c7e",
              },
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatApp;
