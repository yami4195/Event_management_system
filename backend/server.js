import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/services/socket.service.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
