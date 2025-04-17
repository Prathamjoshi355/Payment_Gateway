const express = require("express");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/payments.routes");

const app = express();

app.use(bodyParser.json());
app.use("/api/payments", paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
