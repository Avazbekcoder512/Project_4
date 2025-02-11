const axios = require("axios");
const fs = require("fs");
const path = require("path");

exports.Result = async (ctx) => {
    if (!ctx.session) ctx.session = {};

    if (!ctx.session.waitingForOrder) {
        ctx.session.waitingForOrder = true;
        await ctx.reply("📄 Tahlil natijasini olish uchun Order Numberingizni kiriting:", {
            reply_markup: { force_reply: true },
        });
        return;
    }

    if (!ctx.session.orderNumber) {
        if (!/^\d+$/.test(ctx.message.text)) {
            return await ctx.reply("❌ Iltimos, faqat raqam kiriting!");
        }

        ctx.session.orderNumber = ctx.message.text;
        await ctx.reply("🔑 Endi Verification Code ni kiriting:", {
            reply_markup: { force_reply: true },
        });
        return;
    }

    const orderNumber = ctx.session.orderNumber;
    const verificationCode = ctx.message.text;

    ctx.session.waitingForOrder = false;
    ctx.session.orderNumber = null;

    try {
        const response = await axios.get("https://project-4-c2ho.onrender.com/download-result", {
            params: { orderNumber, verificationCode },
            responseType: "arraybuffer",
        });

        if (response.status === 200) {
            const pdfFolderPath = "public/pdf";
            if (!fs.existsSync(pdfFolderPath)) fs.mkdirSync(pdfFolderPath, { recursive: true });

            const pdfPath = `${pdfFolderPath}/result_${orderNumber}.pdf`;
            fs.writeFileSync(pdfPath, response.data);

            await ctx.reply("✅ Kodlar to‘g‘ri! PDF fayl yuklanmoqda...");
            await ctx.replyWithDocument({
                source: pdfPath,
                filename: "tahlil_natijasi.pdf",
            });

            setTimeout(() => {
                fs.unlink(pdfPath, (err) => {
                    if (err) console.log("❌ PDF faylni o‘chirishda xatolik:", err);
                    else console.log(`🗑️ Fayl o‘chirildi: ${pdfPath}`);
                });
            }, 10000);
        } else {
            await ctx.reply("❌ Order Number yoki Verification Code noto‘g‘ri. Qayta urinib ko‘ring.");
        }
    } catch (error) {
        console.log(error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
    }
};
