const { createClient } = require("@supabase/supabase-js");
const axios = require('axios');
const { enMenyu } = require("../menyuKeyboard");
require('dotenv').config()

const supabaseUrl = process.env.Supabase_URL;
const supabaseKey = process.env.Supabase_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.enResult = async (ctx) => {
    if (!ctx.session) ctx.session = {};

    if (!ctx.session.waitingForOrder) {
        ctx.session.waitingForOrder = true;
        await ctx.reply("📄 To receive your test results, enter your Order Number sent to your email:", {
            reply_markup: { force_reply: true },
        });
        return;
    }

    if (!ctx.session.orderNumber) {
        if (!/^\d+$/.test(ctx.message.text)) {
            return await ctx.reply("❌ Please enter a number only!");
        }

        ctx.session.orderNumber = ctx.message.text;
        await ctx.reply("🔑 Now enter the Verification Code:", {
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
            return await ctx.reply("You've tried too many times! Try again in 5 minutes!")
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
                return await ctx.reply("❌ There was an error loading the PDF file.");
            }

            const { data: urlData } = supabase
                .storage
                .from("Images")
                .getPublicUrl(pdfFilename);

            if (!urlData || !urlData.publicUrl) {
                return await ctx.reply("❌ There was an error retrieving the PDF.");
            }

            const publicURL = urlData.publicUrl;

            await ctx.reply("✅ The codes are correct! Loading PDF file...");
            await ctx.replyWithDocument(publicURL, {
                caption: `📄 Analysis result`,
            });
            await enMenyu(ctx)

            setTimeout(async () => {
                const filePath = publicURL.replace(
                    `${supabase.storageUrl}/object/public/Images/`,
                    ""
                );
                await supabase.storage.from("Images").remove([filePath]);
            }, 60000);
        } else if (response.status === 404) {
            await ctx.reply("❌ The Order Number or Verification Code is incorrect. Please try again.");
        } else {
            await ctx.reply("❌ An error occurred. Please try again later.");
        }
    } catch (error) {
        console.log("❌ Xatolik:", error);
        await ctx.reply("❌ There was an error connecting to the server. Please try again later.");
    }
};