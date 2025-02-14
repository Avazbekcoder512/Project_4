const { createClient } = require("@supabase/supabase-js");
const axios = require('axios');
const { Menyu } = require("./menyu");
require('dotenv').config()

const supabaseUrl = process.env.Supabase_URL;
const supabaseKey = process.env.Supabase_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.Result = async (ctx) => {
    if (!ctx.session) ctx.session = {};

    if (!ctx.session.waitingForOrder) {
        ctx.session.waitingForOrder = true;
        await ctx.reply("📄 Tahlil natijasini olish uchun emailingizga yuborilgan Tartib raqamingizni kiriting:", {
            reply_markup: { force_reply: true },
        });
        return;
    }

    if (!ctx.session.orderNumber) {
        if (!/^\d+$/.test(ctx.message.text)) {
            return await ctx.reply("❌ Iltimos, faqat raqam kiriting!");
        }

        ctx.session.orderNumber = ctx.message.text;
        await ctx.reply("🔑 Endi Tasdiqlash kodi ni kiriting:", {
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
            validateStatus: (status) => status < 500
        });

        if (response.status === 429) {
            return await ctx.reply("Siz juda ko'p urinish qildingiz! 5 daqiqdan so'ng urinib ko'ring!")
        }

        if (response.status === 200) {
            const timestamp = Date.now();
            const pdfFilename = `pdf/result_${orderNumber}_${timestamp}.pdf`;

            const { data, error } = await supabase
                .storage
                .from("Images")
                .upload(pdfFilename, response.data, {
                    contentType: "application/pdf",
                    cacheControl: "3600",
                    upsert: true
                });

            if (error) {
                console.log("❌ Supabase upload error:", error);
                return await ctx.reply("❌ PDF faylni yuklashda xatolik yuz berdi.");
            }

            const { data: urlData } = supabase
                .storage
                .from("Images")
                .getPublicUrl(pdfFilename);

            if (!urlData || !urlData.publicUrl) {
                return await ctx.reply("❌ PDF'ni olishda xatolik yuz berdi.");
            }

            const publicURL = urlData.publicUrl;

            await ctx.reply("✅ Kodlar to‘g‘ri! PDF fayl yuklanmoqda...");
            await ctx.replyWithDocument(publicURL, {
                caption: `📄 Tahlil natijasi`,
            });
            await Menyu(ctx)

            setTimeout(async () => {
                const filePath = publicURL.replace(
                    `${supabase.storageUrl}/object/public/Images/`,
                    ""
                  );
                await supabase.storage.from("Images").remove([filePath]);
            }, 60000);
        } else if (response.status === 404) {
            await ctx.reply("❌ Order Number yoki Verification Code noto‘g‘ri. Qayta urinib ko‘ring.");
        } else {
            await ctx.reply("❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
        }
    } catch (error) {
        console.log("❌ Xatolik:", error);
        await ctx.reply("❌ Server bilan bog‘lanishda xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring.");
    }
};