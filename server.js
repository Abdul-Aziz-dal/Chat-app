import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { Execute } from "./src/app/components/db/connection.js";
import moment from "moment";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory storage for user-to-socket mappings
const users = {};

const startServer = async () => {
  try {
    const now = new Date();
    const currentDate = moment().format("YYYY-MM-DD H:mm:ss");
    await app.prepare();

    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
      cors: {
        origin: "*", // Adjust this to your domain in production
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Register user ID with socket ID
      socket.on("register_user", (userId) => {
        users[userId] = socket.id;
        console.log("usersbbbb:", users);
        // console.log("Registered users:", users);
      });

      // Handle message events and send them to the specific recipient
      socket.on("message", async (data) => {
        // console.log("Message received on server:", data);
        const query = `INSERT INTO content (message,user_id,sender_id,receiver_id,added_on) VALUES (?,?,?,?,?)`;
        const values = [
          data.text || "",
          data.userId,
          data.senderID,
          data.receiverID,
          currentDate,
        ];

        const result = await Execute(query, values);
        console.log("result ", result);
        const receiverSocketId = users[data.receiverID];
        if (receiverSocketId) {
          // Emit the message only to the intended recipient
          io.to(receiverSocketId).emit("receive-message", data);
        } else {
          console.log(`Receiver ${data.receiverID} is not connected.`);
        }
      });

      // Remove user mapping on disconnect
      // socket.on("disconnect", () => {
      //   console.log(`User disconnected: ${socket.id}`);
      //   for (const [userId, socketId] of Object.entries(users)) {
      //     if (socketId === socket.id) {
      //       delete users[userId];
      //       console.log(`User ${userId} removed from users list.`);
      //       break;
      //     }
      //   }
      // });
    });

    const PORT = 3001;
    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();
