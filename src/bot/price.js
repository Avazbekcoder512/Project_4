const { InlineKeyboard } = require("grammy");
const { sectionModel } = require("../models/sectionModel");

async function sendSections(ctx, chatId, page = 1, messageId) {
    try {
        const options = { page, limit: 9 }; 
        const result = await sectionModel.paginate({}, options);
        
        if (!result.docs.length) {
            return ctx.reply("⚠️ Hozircha bo'limlar mavjud emas.");
        }

        let text = `📋 **Bo'limlar ro'yxati (Sahifa ${result.page})**\n\n`;
        const keyboard = new InlineKeyboard();

        result.docs.forEach((section, index) => {
            text += `🔹 ${index + 1}. *${section.uz_name}*\n`;
            keyboard.text(`${index + 1}`, `section_${page}_${index}`);
            if ((index + 1) % 3 === 0) keyboard.row();
        });

        if (result.hasPrevPage || result.hasNextPage) keyboard.row();
        if (result.hasPrevPage) keyboard.text("⬅️ Orqaga", `section_page_${result.prevPage}`);
        if (result.hasNextPage) keyboard.text("Oldinga ➡️", `section_page_${result.nextPage}`);

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

exports.priceCallbackQuery = async (ctx) => {
    try {
        const chatId = ctx.callbackQuery.message.chat.id;
        const messageId = ctx.callbackQuery.message.message_id;
        const data = ctx.callbackQuery.data;

        if (data.startsWith("section_page_")) {
            const page = parseInt(data.split("_")[2]);
            await sendSections(ctx, chatId, page, messageId);
        } else if (data.startsWith("section_")) {
            const [_, page, index] = data.split("_").map(Number);
            const options = { page, limit: 9 };
            const result = await sectionModel.paginate({}, options);
            const section = result.docs[index];

            if (section) {
                const populatedSection = await sectionModel.findById(section._id).populate("analyses");
                
                let text = `📋 *${populatedSection.name} bo'limi*\n\n`;
                populatedSection.analyses.forEach((analysis, idx) => {
                    text += `🧪 ${idx + 1}. *${analysis.name}* - ${analysis.price} so'm\n`;
                });

                const keyboard = new InlineKeyboard().text("⬅️ Orqaga", "back_to_sections");
                
                await ctx.api.editMessageText(chatId, messageId, text, {
                    parse_mode: "Markdown",
                    reply_markup: keyboard
                });
            }
        } else if (data === "back_to_sections") {
            await sendSections(ctx, chatId, 1, messageId);
        }

        await ctx.answerCallbackQuery().catch((err) => console.error("CallbackQuery Error:", err));
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Serverda xatolik!')
    }
};

exports.Sections = async (ctx) => {
    const chatId = ctx.chat.id;
    await sendSections(ctx, chatId);
};
