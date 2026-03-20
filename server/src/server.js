import app from "./app.js";
import connectDB from "./config/database.config.js";
import env from "./config/environment.config.js";

const bootstrap = async () => {
  try {
    await connectDB();

    const port = env.IS_PRODUCTION ? env.PORT : env.LOCAL_DEV_PORT;

    app.listen(port, () => {
      console.log(
        `Server Vessels Management running in ${env.BUILD_MODE} mode on port ${port}${
          env.AUTHOR ? ` by ${env.AUTHOR}` : ""
        }`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

bootstrap();
