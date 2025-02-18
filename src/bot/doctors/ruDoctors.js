const { InlineKeyboard } = require("grammy");
const { doctorModel } = require("../../models/doctorModel");

async function sendRuDoctors(ctx, chatId, page = 1, messageId) {
    try {
        const options = { page, limit: 9 };
        const result = await doctorModel.paginate({}, options);        

        if (!result.docs.length) {
            return ctx.reply("⚠️ Врачей пока нет.");
        }

        let text = `👨‍⚕ **Список врачей (Страница ${result.page})**\n\n`;
        const keyboard = new InlineKeyboard();

        result.docs.forEach((doctor, index) => {
            text += `🔹 ${index + 1}. *${doctor.ru_name}* - ${doctor.ru_position}\n`;
            keyboard.text(`${index + 1}`, `rudoctor_${page}_${index}`);
            if ((index + 1) % 3 === 0) keyboard.row();
        });

        if (result.hasPrevPage || result.hasNextPage) keyboard.row();
        if (result.hasPrevPage) keyboard.text("⬅️ Назад", `page_${result.prevPage}`);
        if (result.hasNextPage) keyboard.text("Вперед ➡️", `page_${result.nextPage}`);

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
        ctx.reply('🆘  Ошибка сервера!')
    }
}

exports.ruDoctorsQuery = async (ctx) => {
    try {
        const chatId = ctx.callbackQuery.message.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        const data = ctx.callbackQuery.data;

        if (data.startsWith("page_")) {
            const page = parseInt(data.split("_")[1]);
            await sendRuDoctors(ctx, chatId, page, messageId);
        } else if (data.startsWith("rudoctor_")) {
            const [_, page, index] = data.split("_").map(Number);
            const options = { page, limit: 9 };
            const result = await doctorModel.paginate({}, options);
            const doctor = result.docs[index];

            if (doctor) {
                const text = `👨‍⚕ *${doctor.ru_name}*\n📌 *Специальность:* ${doctor.ru_position}\n📆 *Опыт работы:* ${doctor.ru_experience}\n🏅 *Категория:* ${doctor.ru_category}\n📞 *Телефон:* ${doctor.phoneNumber}\n`;

                const keyboard = new InlineKeyboard().text("⬅️ Назад", `back_to_rudoctors_${messageId}`);

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
        } else if (data.startsWith("back_to_rudoctors_")) {

            await ctx.api.deleteMessage(chatId, messageId).catch(() => { });

            await sendRuDoctors(ctx, chatId);
        }

        await ctx.answerCallbackQuery().catch((err) => console.error("CallbackQuery Error:", err));
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Ошибка сервера!')
    }
};

exports.ruDoctors = async (ctx) => {
    const chatId = ctx.chat.id;
    await sendRuDoctors(ctx, chatId);
};
