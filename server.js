const express = require('express');
const { connectDB } = require("./src/database/connect");
const { appRouter } = require('./src/Router/router');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const { bot } = require('./src/bot/bot');
require('dotenv').config();

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_PARSER_KEY));
appRouter(app);

app.use(`/${process.env.BOT_TOKEN}`, express.json(), (req, res) => {
    bot.handleUpdate(req.body, res);
});

await bot.api.setWebhook(`${process.env.WEBHOOK_URL}/${process.env.BOT_TOKEN}`);
    console.log('✅ Webhook o‘rnatildi:', `${process.env.WEBHOOK_URL}/${process.env.BOT_TOKEN}`);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on Port: ${PORT}... `);
});
