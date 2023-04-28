const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth_routes").router;
const walletRoutes = require("./routes/wallet_routes").router;
const settingRoutes = require("./routes/setting_routes").router;
const webhookRoutes = require("./routes/webhook_routes").router;
const transactionRoutes = require("./routes/transaction_routes").router;
const userRoutes = require("./routes/user_routes").router;

const { all, authenticateHeader } = require("./middleware/error_middleware");

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api", [
    authRoutes,
    settingRoutes,
    webhookRoutes,
    authenticateHeader,
    userRoutes,
    walletRoutes,
    transactionRoutes
]);

app.use(all);

app.listen(PORT, () => {
    console.log(`Server started on port ${ PORT }`);
}).on("error", err => {
    console.log("ERROR: ", err);
});