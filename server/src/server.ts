/**
 * @copyright 2026
 * @author Fardin Islam Selim
 * @license Apache-2.0
 */

/**
 * Node.js Built-in Modules
 */
import type { Server } from "http";

/**
 * Third-Party Modules
 */
import colors from "colors";

/**
 * Application Module
 */
import app from "@/app";
import config from "@/config";

/**
 * Server
 */
let server: Server | undefined;

/**
 * Main Function
 */
async function main (){
    server = app.listen(config.port, ()=>{
        console.log(
            colors.italic.green.bold(`Server is running on http://localhost:${config.port}`)
        );
    })
}

/**
 * Start Server
 */
main().catch((err)=>{
    console.error("Error starting server:", err);
    process.exit(1);
})

/**
 * Unhandled Rejection
 */
process.on("unhandledRejection", err =>{
    console.error("Unhandled rejection:", err);
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
})

/**
 * Uncaught Exception
 */
process.on("uncaughtException", err=>{
    console.error("Uncaught exception:", err);
    if(server){
        server.close(()=>{
            process.exit(1);
        })
    }
})