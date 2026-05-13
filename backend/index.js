const express = require("express");
const cors    = require("cors");

const usersRoute = require("./routes/users");

const app  = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`MoonDive backend running on http://localhost:${PORT}`);
});
