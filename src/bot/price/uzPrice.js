const { InlineKeyboard } = require("grammy");
const { sectionModel } = require("../../models/sectionModel");

async function sendUzPrice(ctx, page = 1, editMessage = false) {
    try {
        const option = { page, limit: 5 };
        const result = await sectionModel.paginate({}, option);

        if (!result.docs.length) {
            return ctx.reply("⚠️ Hozircha bo'limlar mavjud emas.");
        }

        let text = `🏥 **Bo'limlar ro'yhati (Sahifa ${result.page})**\n\n`;
        const keyboard = new InlineKeyboard();

        result.docs.forEach((section, index) => {
            text += `🔹 ${index + 1}. *${section.uz_name}*\n`;
            keyboard.text(`${index + 1}`, `section_${page}_${index}`);
            if ((index + 1) % 3 === 0) keyboard.row();
        });

        if (result.hasPrevPage || result.hasNextPage) keyboard.row();
        if (result.hasPrevPage) keyboard.text('⬅️ Oldingi sahifa', `sheet_${result.prevPage}`);
        if (result.hasNextPage) keyboard.text('Keyingi sahifa ➡️', `sheet_${result.nextPage}`);

        const chatId = ctx.chat.id;
        const messageId = ctx.callbackQuery?.message?.message_id;

        if (editMessage && messageId) {
            await ctx.api.editMessageText(chatId, messageId, text, {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        } else {
            await ctx.reply(text, {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
            });
        }
    } catch (error) {
        console.log(error);
        ctx.reply('🆘 Serverda xatolik!');
    }
}

exports.uzPriceQuery = async (ctx) => {
    try {
        const data = ctx.callbackQuery.data;
        const chatId = ctx.chat.id;
        const messageId = ctx.callbackQuery?.message?.message_id;

        if (data.startsWith('sheet_')) {
            const page = parseInt(data.split('_')[1]);
            await sendUzPrice(ctx, page, messageId);
        } else if (data.startsWith("section_")) {
            const [_, page, index] = data.split("_").map(Number);
            const options = { page, limit: 5 };
            const result = await sectionModel.paginate({}, options);
            const section = result.docs[index];

            if (section) {
                const populatedSection = await sectionModel.findById(section._id).populate("analysis");

                let text = `📋 *${populatedSection.uz_name} bo‘limidagi xizmatlar:*\n\n`;
                populatedSection.analysis.forEach((analysis, idx) => {
                    text += `🔬 ${idx + 1}. *${analysis.name}* - ${analysis.price} so‘m\n`;
                });

                const keyboard = new InlineKeyboard().text('⬅️ Orqaga', `back_to_sections_${page}`);

                await ctx.api.editMessageText(chatId, messageId, text, {
                    parse_mode: "Markdown",
                    reply_markup: keyboard,
                });
            }
        } else if (data.startsWith('back_to_sections_')) {
            const page = Number(data.split("_")[1]);        
            await sendUzPrice(ctx, page, messageId, true);
        }
        
        await ctx.answerCallbackQuery().catch((err) => console.error("CallbackQuery Error:", err));
    } catch (error) {
        console.log("Xatolik:", error);
        ctx.reply('🆘 Serverda xatolik!');
    }
};

exports.uzSections = async (ctx) => {
    await sendUzPrice(ctx, 1);
};
