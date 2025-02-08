const { InlineKeyboard } = require("grammy");
const { newsModel } = require("../models/newsModel");

async function sendNews(ctx, page = 1) {
    const options = {
        page: Math.max(1, page),
        limit: 1,
    };

    const result = await newsModel.paginate({}, options);

    console.log(result);
    

    if (!result.docs.length) {
        return ctx.reply("⚠️ Yangiliklar topilmadi.");
    }

    const news = result.docs[0];
    userPages.set(ctx.chat.id, page);

    const keyboard = new InlineKeyboard();
    if (page > 1) {
        keyboard.text("⬅️ Ortga", `news_${page - 1}`);
    }
    keyboard.text(`📄 ${page}/${result.totalPages}`, `noop`).row();
    if (page < result.totalPages) {
        keyboard.text("Oldinga ➡️", `news_${page + 1}`);
    }

    const caption = `<b>${news.title}</b>\n\n${news.description}`;

    if (news.image) {
        await ctx.replyWithPhoto(news.image, {
            caption,
            parse_mode: "HTML",
            reply_markup: keyboard,
        });
    } else {
        await ctx.reply(caption, {
            parse_mode: "HTML",
            reply_markup: keyboard,
        });
    }
}

exports.newsCallbackQuery = async (ctx) => {
    try {
        const page = parseInt(ctx.match[1]);
        await sendNews(ctx, page);
        await ctx.answerCallbackQuery();
    } catch (error) {
        console.error("Xatolik:", error);
        ctx.reply('🆘  Serverda xatolik!');
    }
};

exports.News = async (ctx) => {
    const chatId = ctx.chat.id;
    await sendNews(ctx, chatId);
};
