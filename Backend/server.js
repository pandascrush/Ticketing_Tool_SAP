import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.routes.mjs";
import internalRoutes from "./routes/internal.routes.mjs";
import designationRoutes from "./routes/designation.routes.mjs";
import errorMiddleware from "./middleware/error.middleware.mjs";
import clientRoutes from "./routes/client.routes.mjs";
import authRoutes from "./routes/auth.routes.mjs";
import ticketRoutes from "./routes/ticket.routes.mjs";
import clientServicesRoutes from "./routes/clientService.routes.mjs";
import adminRouets from './routes/admin.routes.mjs'
import seniorConsultant from './routes/s.consultant.routes.mjs'
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyToken } from "./middleware/Verification.mjs";
import './controllers/remainder.controller.mjs'

const app = express();

app.use(bodyParser.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true // Allow credentials (cookies, HTTP authentication)
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));
app.use(cookieParser())

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Define routes
app.use("/api/user", userRoutes);
app.use('/verify',verifyToken,authRoutes)
app.use("/api/internal", internalRoutes);
app.use("/api/desig", designationRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/serve", clientServicesRoutes);
app.use("/api/admin",adminRouets)
app.use('/api/seniorcons',seniorConsultant)

// Static files
app.use("/uploads", express.static("uploads"));

// Error handling middlewar
app.use(errorMiddleware);

app.get("/hi", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
