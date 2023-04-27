const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");

//const { router: authRoutes } = require("./routes/auth_routes");

const authRoutes = require("./routes/auth_routes").router;
const walletRoutes = require("./routes/wallet_routes").router;
const settingRoutes = require("./routes/setting_routes").router;
const webhookRoutes = require("./routes/webhook_routes").router;
// const transactionRoutes = require("./src/server/routes/transaction_routes").router;
// const transferRoutes = require("./src/server/routes/transfer_routes").router;
// const imageRoutes = require("./src/server/routes/image_routes").router;

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
    walletRoutes,
    // transactionRoutes,
    // transferRoutes,
    // imageRoutes
]);



// app.use(all);

app.listen(PORT, () => {
    console.log(`Server started on port ${ PORT }`);
}).on("error", err => {
    console.log("ERROR: ", err);
});