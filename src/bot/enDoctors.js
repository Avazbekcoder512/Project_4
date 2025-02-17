const { InlineKeyboard } = require("grammy");
const { doctorModel } = require("../models/doctorModel");

async function sendEnDoctors(ctx, chatId, page = 1, messageId) {
    try {
        const options = { page, limit: 9 };
        const result = await doctorModel.paginate({}, options);        

        if (!result.docs.length) {
            return ctx.reply("⚠️ There are no doctors available yet.");
        }

        let text = `👨‍⚕ **List of doctors (Page ${result.page})**\n\n`;
        const keyboard = new InlineKeyboard();

        result.docs.forEach((doctor, index) => {
            text += `🔹 ${index + 1}. *${doctor.en_name}* - ${doctor.en_position}\n`;
            keyboard.text(`${index + 1}`, `endoctor_${page}_${index}`);
            if ((index + 1) % 3 === 0) keyboard.row();
        });

        if (result.hasPrevPage || result.hasNextPage) keyboard.row();
        if (result.hasPrevPage) keyboard.text("⬅️ Back", `page_${result.prevPage}`);
        if (result.hasNextPage) keyboard.text("Next ➡️", `page_${result.nextPage}`);

        if (messageId) {
            await ctx.api.editMessageText(chatId, messageId, text, {
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });
        } else {
            await ctx.api.sendMessage(chatId, text, {
                parse_mode: "Markdown",
                reply_markup: keyboard,
            });
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Server error!')
    }
}

exports.enDoctorsQuery = async (ctx) => {
    try {
        const chatId = ctx.callbackQuery.message.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        const data = ctx.callbackQuery.data;

        if (data.startsWith("page_")) {
            const page = parseInt(data.split("_")[1]);
            await sendEnDoctors(ctx, chatId, page, messageId);
        } else if (data.startsWith("endoctor_")) {
            const [_, page, index] = data.split("_").map(Number);
            const options = { page, limit: 9 };
            const result = await doctorModel.paginate({}, options);
            const doctor = result.docs[index];

            if (doctor) {
                const text = `👨‍⚕ *${doctor.en_name}*\n📌 *Specialty:* ${doctor.en_position}\n📆 *Experience:* ${doctor.en_experience}\n🏅 *Category:* ${doctor.en_category}\n📞 *Phone:* ${doctor.phoneNumber}\n`;

                const keyboard = new InlineKeyboard().text("⬅️ Back", `back_to_endoctors_${messageId}`);

                if (doctor.image) {
                    await ctx.api.sendPhoto(chatId, doctor.image, {
                        caption: text,
                        parse_mode: "Markdown",
                        reply_markup: keyboard
                    });
                } else {
                    await ctx.api.sendMessage(chatId, text, {
                        parse_mode: "Markdown",
                        reply_markup: keyboard
                    });
                }

                await ctx.api.deleteMessage(chatId, messageId);
            }
        } else if (data.startsWith("back_to_endoctors_")) {

            await ctx.api.deleteMessage(chatId, messageId).catch(() => { });

            await sendEnDoctors(ctx, chatId);
        }

        await ctx.answerCallbackQuery().catch((err) => console.error("CallbackQuery Error:", err));
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Server error!')
    }
};

exports.enDoctors = async (ctx) => {
    const chatId = ctx.chat.id;
    await sendEnDoctors(ctx, chatId);
};
