import { app } from "./src/app.js";
import { dbConnect } from "./src/config/db.js";

const port = process.env.PORT || 500;
await dbConnect();
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
