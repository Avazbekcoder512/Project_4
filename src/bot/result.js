const axios = require("axios");

exports.Result = async (ctx) => {
    if (!ctx.session) ctx.session = {};

    if (!ctx.session.waitingForOrder) {
        ctx.session.waitingForOrder = true;
        await ctx.reply("📄 Tahlil natijasini olish uchun Order Numberingizni kiriting:");
        return;
    }

    if (!ctx.session.orderNumber) {
        ctx.session.orderNumber = ctx.message.text;
        await ctx.reply("🔑 Endi Verification Code ni kiriting:");
        return;
    }

    const orderNumber = ctx.session.orderNumber;
    const verificationCode = ctx.message.text;

    // 🔹 Sessiyani tozalash
    ctx.session.waitingForOrder = false;
    ctx.session.orderNumber = null;

    try {
        const response = await axios.get("https://project-4-c2ho.onrender.com/download-result", {
            params: { orderNumber, verificationCode },
            responseType: "arraybuffer",
        });

        if (response.status === 200) {
            await ctx.reply("✅ Kodlar to‘g‘ri! PDF fayl yuborilmoqda...");
            await ctx.replyWithDocument(new Uint8Array(response.data), {
                filename: "tahlil_natijasi.pdf",
            });
        } else {
            await ctx.reply("❌ Order Number yoki Verification Code noto‘g‘ri. Qayta urinib ko‘ring.");
        }
    } catch (error) {
        console.log(error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
    }
};
