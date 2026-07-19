import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { initSocket } from "./src/services/socket.service.js";
import { ensureSchema } from "./src/utils/ensureSchema.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

ensureSchema().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Cloudinary Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  });
});
