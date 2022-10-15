import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import ToysDAO from "./dao/toysDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js"

async function main() {
    dotenv.config();
    const client = new
        mongodb.MongoClient(process.env.TOYSELLING_DB_URI);
    const port = process.env.PORT || 8000;
    try {
        await client.connect();
        await ToysDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);
        app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    };
}
main().catch(console.error);