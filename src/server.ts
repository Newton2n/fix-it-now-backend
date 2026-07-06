import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;

async function main() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log("data base connection successful");
      console.log(`prisma server listening on port ${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Error occurred on server start", error);
    process.exit(1);
  }
}

main();