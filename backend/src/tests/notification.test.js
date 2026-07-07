import http from "http";
import app from "../app.js";
import { initSocket } from "../services/socket.service.js";
import { io as Client } from "socket.io-client";
import pool from "../config/db.js";

const PORT = 3001; // Use a different port to avoid conflicts
let server;
let socketClient;
let testUserToken;
let testUserId;
let createdNotificationId;

async function runTests() {
  console.log("Starting Notification and Socket.IO Integration Tests...\n");

  // 1. Start Server
  server = http.createServer(app);
  initSocket(server);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[Server] Running on port ${PORT}`);

  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    // 2. Register Test User
    const testEmail = `user_${Date.now()}@test.com`;
    const registerResponse = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: "Test",
        lastname: "Attendee",
        email: testEmail,
        password: "Password123!",
        role: "CUSTOMER",
        phone: "0912345678",
      }),
    });

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      throw new Error(`Failed to register test user: ${registerData.message}`);
    }

    testUserToken = registerData.data.token;
    testUserId = registerData.data.user.id;
    console.log(`[Test User] Registered with ID: ${testUserId}, Email: ${testEmail}`);

    // 3. Connect Socket.IO Client with Auth Token
    socketClient = Client(`http://localhost:${PORT}`, {
      auth: { token: testUserToken },
      transports: ["websocket"],
    });

    await new Promise((resolve, reject) => {
      socketClient.on("connect", () => {
        console.log(`[Socket Client] Connected successfully (Socket ID: ${socketClient.id})`);
        resolve();
      });
      socketClient.on("connect_error", (err) => {
        reject(new Error(`Socket connection failed: ${err.message}`));
      });
    });

    // Set up Socket.IO notification event listener
    const socketNotificationPromise = new Promise((resolve) => {
      socketClient.on("notification", (data) => {
        console.log("[Socket Client] Received notification in real-time:", data);
        resolve(data);
      });
    });

    // 4. Test GET /api/notifications (Should be empty initially)
    const listRes1 = await fetch(`${baseUrl}/notifications`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const listData1 = await listRes1.json();
    console.log(`[GET /api/notifications] Returned ${listData1.data.notifications.length} notifications`);

    // 5. Test POST /api/notifications (Create Notification)
    console.log(`[POST /api/notifications] Creating notification for user ${testUserId}...`);
    const createRes = await fetch(`${baseUrl}/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        user_id: testUserId,
        message: "Your registration for the Tech Conference is confirmed!",
        type: "reminder",
      }),
    });

    const createData = await createRes.json();
    if (!createData.success) {
      throw new Error(`Failed to create notification: ${createData.message}`);
    }
    const createdNotification = createData.data.notification;
    createdNotificationId = createdNotification.notification_id;
    console.log(`[POST /api/notifications] Created notification with ID: ${createdNotificationId}`);

    // 6. Verify Real-time Socket.IO emission
    console.log("[Socket Client] Waiting for notification event...");
    const receivedNotification = await socketNotificationPromise;
    if (String(receivedNotification.notification_id) !== String(createdNotificationId)) {
      throw new Error("Received socket notification ID does not match created notification ID!");
    }
    console.log("[Socket Client] Real-time push verified successfully!");

    // 7. Test GET /api/notifications/:id
    const getRes = await fetch(`${baseUrl}/notifications/${createdNotificationId}`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const getData = await getRes.json();
    if (!getData.success || String(getData.data.notification.notification_id) !== String(createdNotificationId)) {
      throw new Error("Failed to retrieve the specific notification.");
    }
    console.log(`[GET /api/notifications/:id] Successfully retrieved notification.`);

    // 8. Test PATCH /api/notifications/:id/read
    const readRes = await fetch(`${baseUrl}/notifications/${createdNotificationId}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const readData = await readRes.json();
    if (!readData.success || !readData.data.notification.is_read) {
      throw new Error("Failed to mark notification as read.");
    }
    console.log(`[PATCH /api/notifications/:id/read] Successfully marked notification as read.`);

    // 9. Test DELETE /api/notifications/:id
    const deleteRes = await fetch(`${baseUrl}/notifications/${createdNotificationId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const deleteData = await deleteRes.json();
    if (!deleteData.success) {
      throw new Error("Failed to delete notification.");
    }
    console.log(`[DELETE /api/notifications/:id] Successfully deleted notification.`);

    // Double check that it's deleted
    const getResAfterDelete = await fetch(`${baseUrl}/notifications/${createdNotificationId}`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    if (getResAfterDelete.status !== 404) {
      throw new Error("Notification still exists after deletion!");
    }
    console.log(`[DELETE /api/notifications/:id] Verified deletion (returned 404 on fetch).`);

    console.log("\nALL TESTS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("\nTEST SUITE FAILED:");
    console.error(error);
  } finally {
    // Cleanup and exit
    if (socketClient) {
      socketClient.disconnect();
    }
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      console.log("[Server] Stopped.");
    }

    // Clean up database test user and notifications (cascade)
    if (testUserId) {
      await pool.query("DELETE FROM users WHERE user_id = $1", [testUserId]);
      console.log(`[Cleanup] Deleted test user ${testUserId} from DB.`);
    }

    await pool.end();
    process.exit(0);
  }
}

runTests();
