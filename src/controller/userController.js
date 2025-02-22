const { default: axios } = require("axios");
const { query } = require("express");
require('dotenv').config()


exports.addUser = async (req, res, bot) => {
    try {
        const data = req.body
        console.log("Web App'dan kelgan ma'lumot:", data);

        await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            query_id: data.query_id,
            text: `📩 Web App'dan yangi ma'lumot:\n\n${JSON.stringify(data, null, 2)}`
        });

    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).json({ success: false, message: "Xatolik yuz berdi!" });
    }
}