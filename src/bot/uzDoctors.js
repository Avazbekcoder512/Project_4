const { InlineKeyboard } = require("grammy");
const { doctorModel } = require("../models/doctorModel");

async function sendUzDoctors(ctx, chatId, page = 1, messageId) {
    try {
        const options = { page, limit: 9 };
        const result = await doctorModel.paginate({}, options);        

        if (!result.docs.length) {
            return ctx.reply("⚠️ Hozircha shifokorlar mavjud emas.");
        }

        let text = `👨‍⚕ **Shifokorlar ro'yxati (Sahifa ${result.page})**\n\n`;
        const keyboard = new InlineKeyboard();

        result.docs.forEach((doctor, index) => {
            text += `🔹 ${index + 1}. *${doctor.uz_name}* - ${doctor.uz_position}\n`;
            keyboard.text(`${index + 1}`, `uzdoctor_${page}_${index}`);
            if ((index + 1) % 3 === 0) keyboard.row();
        });

        if (result.hasPrevPage || result.hasNextPage) keyboard.row();
        if (result.hasPrevPage) keyboard.text("⬅️ Orqaga", `page_${result.prevPage}`);
        if (result.hasNextPage) keyboard.text("Oldinga ➡️", `page_${result.nextPage}`);

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
        ctx.reply('🆘  Serverda xatolik!')
    }
}

exports.uzDoctorsQuery = async (ctx) => {
    try {
        const chatId = ctx.callbackQuery.message.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        const data = ctx.callbackQuery.data;

        if (data.startsWith("page_")) {
            const page = parseInt(data.split("_")[1]);
            await sendUzDoctors(ctx, chatId, page, messageId);
        } else if (data.startsWith("uzdoctor_")) {
            const [_, page, index] = data.split("_").map(Number);
            const options = { page, limit: 9 };
            const result = await doctorModel.paginate({}, options);
            const doctor = result.docs[index];

            if (doctor) {
                const text = `👨‍⚕ *${doctor.uz_name}*\n📌 *Mutaxassisligi:* ${doctor.uz_position}\n📆 *Tajriba:* ${doctor.uz_experience}\n🏅 *Toifasi:* ${doctor.uz_category}\n📞 *Telefon:* ${doctor.phoneNumber}\n`;

                const keyboard = new InlineKeyboard().text("⬅️ Orqaga", `back_to_uzdoctors_${messageId}`);

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
        } else if (data.startsWith("back_to_uzdoctors_")) {

            await ctx.api.deleteMessage(chatId, messageId).catch(() => { });

            await sendUzDoctors(ctx, chatId);
        }

        await ctx.answerCallbackQuery().catch((err) => console.error("CallbackQuery Error:", err));
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!')
    }
};

exports.uzDoctors = async (ctx) => {
    const chatId = ctx.chat.id;
    await sendUzDoctors(ctx, chatId);
};
