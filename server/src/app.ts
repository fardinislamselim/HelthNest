import express, { Request, Response, type Application, } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import httpStatus from 'http-status'
import helmet from 'helmet'
import config from '@/config'
import router from '@/routes/v1/routes'
import { globalErrorHandler } from '@/middleware/globalErrorHandler'
import { notFound } from '@/middleware/notFound'

// Initialize Express Application
const app:Application = express()

// HTTP Security Headers Middleware
app.use(
  helmet({
    contentSecurityPolicy: config.node_env === "production",
  }),
);


// CORS Configuration
app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
        methods: ['GET', 'POST', 'PUT',"PATCH", 'DELETE'],
    }),
)


// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));


// Cookie Parsing Middleware
app.use(cookieParser())


// API Routes
app.use("/api/v1", router)


// Root Route
app.get('/', async (req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Welcome to HelthNest Backend',
        env: config.node_env,
        time: new Date().toLocaleTimeString()
    })
})


// Global Error Handler Middleware
app.use(globalErrorHandler)


// Not Found Middleware
app.use(notFound)


// Export Application

export default app