const { createClient } = require("@supabase/supabase-js");
const axios = require('axios');
const { ruMenyu } = require("../menyuKeyboard");
require('dotenv').config()

const supabaseUrl = process.env.Supabase_URL;
const supabaseKey = process.env.Supabase_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.ruResult = async (ctx) => {
    if (!ctx.session) ctx.session = {};

    if (!ctx.session.waitingForOrder) {
        ctx.session.waitingForOrder = true;
        await ctx.reply("📄 Чтобы получить результаты теста, введите номер заказа, отправленный на вашу электронную почту:", {
            reply_markup: { force_reply: true },
        });
        return;
    }

    if (!ctx.session.orderNumber) {
        if (!/^\d+$/.test(ctx.message.text)) {
            return await ctx.reply("❌ Пожалуйста, введите только число!");
        }

        ctx.session.orderNumber = ctx.message.text;
        await ctx.reply("🔑 Теперь введите проверочный код:", {
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
            return await ctx.reply("Ты так старался! Попробуйте еще раз через 5 минут!")
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
                return await ctx.reply("❌ Произошла ошибка при загрузке PDF-файла.");
            }

            const { data: urlData } = supabase
                .storage
                .from("Images")
                .getPublicUrl(pdfFilename);

            if (!urlData || !urlData.publicUrl) {
                return await ctx.reply("❌ Произошла ошибка при извлечении PDF-файла.");
            }

            const publicURL = urlData.publicUrl;

            await ctx.reply("✅ Коды верны! Загрузка PDF-файла...");
            await ctx.replyWithDocument(publicURL, {
                caption: `📄 Результат анализа`,
            });
            await ruMenyu(ctx)

            setTimeout(async () => {
                const filePath = publicURL.replace(
                    `${supabase.storageUrl}/object/public/Images/`,
                    ""
                );
                await supabase.storage.from("Images").remove([filePath]);
            }, 60000);
        } else if (response.status === 404) {
            await ctx.reply("❌ Номер заказа или проверочный код неверны. Попробуйте еще раз.");
        } else {
            await ctx.reply("❌ Произошла ошибка. Попробуйте еще раз позже.");
        }
    } catch (error) {
        console.log("❌ Xatolik:", error);
        await ctx.reply("❌ Произошла ошибка при подключении к серверу. Попробуйте еще раз позже.");
    }
};