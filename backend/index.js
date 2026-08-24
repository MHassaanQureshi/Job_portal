import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/user.route.js";
import CompanyRoutes from "./routes/company.route.js";
import JobRoutes from "./routes/job.route.js";
import ApplicationRoutes from "./routes/application.route.js";

dotenv.config({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// Ensure DB Connection Middleware for Serverless
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Root / Health Check API
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Job Portal Backend API is running successfully!",
        success: true
    });
});

// APIs
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/company", CompanyRoutes);
app.use("/api/v1/job", JobRoutes);
app.use("/api/v1/application", ApplicationRoutes);

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
}

export default app;