const { Bot, session, Keyboard } = require('grammy');
const { commands } = require('./commands');
const { uzDoctorsQuery } = require('./doctors/uzDoctors');
const { uzResult } = require('./result/uzResult');
const { userModel } = require('../models/usersModel');
const { Menyu } = require('./menu');
const { ruDoctorsQuery } = require('./doctors/ruDoctors');
const { enDoctorsQuery } = require('./doctors/enDoctors');
const { uzPriceQuery } = require('./price/uzPrice');
const { ruPriceQuery } = require('./price/ruPrice');
const { enPriceQuery } = require('./price/enPrice');
const { ruResult } = require('./result/ruResult');
const { enResult } = require('./result/enResult');
require('dotenv').config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(session({ initial: () => ({}) }));

bot.api.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish! / Запустите бота! / Launch the bot!' },
    { command: 'lang', description: "Tilni o'zgartirish! / Изменить язык! / Change language!" },
    { command: 'info', description: "Bot haqida ma'lumot! / Информация о боте! / Bot information!" },
    { command: 'social_networks', description: "Bizga obuna bo'ling! / Подпишитесь на нас! / Subscribe to us!" }
]);

commands(bot);

bot.on("message:text", async (ctx) => {
    const user = await userModel.findOne({chatId: ctx.chat.id})
    ctx.session = ctx.session ?? {};
    if (user.language === "Language-Uzb" && ctx.session.waitingForOrder) {
        return await uzResult(ctx);
    } else if (user.language === "Language-Rus" && ctx.session.waitingForOrder) {
        return await ruResult(ctx)
    } else if (user.language === "Language-Eng" && ctx.session.waitingForOrder) {
        return await enResult(ctx)
    }

    const text = ctx.message.text;

    Menyu(text, ctx)
});

bot.callbackQuery(/\bLanguage-(Uzb|Rus|Eng)\b/, async (ctx) => {
    const user = await userModel.findOne({ chatId: ctx.callbackQuery.from.id })

    await ctx.answerCallbackQuery();
    await ctx.deleteMessage()
    if (user.language) {
        await userModel.findByIdAndUpdate(user.id, { language: ctx.callbackQuery.data }, { new: true })
        switch (ctx.callbackQuery.data) {
            case "Language-Uzb":
                await ctx.reply(`Botdan to'liq foydalanish uchun <b>📋 Menyu</b> tugmasini bosing!`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: new Keyboard().text("📋 Menyu").resized()
                    })
                break;
            case "Language-Rus":
                await ctx.reply(`Чтобы в полной мере использовать возможности бота, нажмите кнопку <b>📋 Меню</b>!`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: new Keyboard().text("📋 Меню").resized()
                    })
                break;
            case "Language-Eng":
                await ctx.reply(`To use the bot to its full potential, press the <b>📋 Menu</b> button!`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: new Keyboard().text("📋 Menu").resized()
                    })
                break;
        }
    } else {
        await userModel.findByIdAndUpdate(user.id, { language: ctx.callbackQuery.data }, { new: true })
        if (ctx.callbackQuery.from.first_name === undefined) {
            switch (ctx.callbackQuery.data) {
                case "Language-Uzb":
                    await ctx.reply(`Assalomu alaykum <b>${ctx.callbackQuery.from.username}</b> botimizga xush kelibsiz!\n
Botdan to'liq foydalanish uchun <b>📋 Menyu</b> tugmasini bosing!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Menyu").resized()
                        })
                    break;
                case "Language-Rus":
                    await ctx.reply(`Здравствуйте, добро пожаловать в наш <b>${ctx.callbackQuery.from.username}</b> бот!\n
Чтобы в полной мере использовать возможности бота, нажмите кнопку <b>📋 Меню</b>!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Меню").resized()
                        })
                    break;
                case "Language-Eng":
                    await ctx.reply(`Hello <b>${ctx.callbackQuery.from.username}</b>, welcome to our bot!\n
To use the bot to its full potential, press the <b>📋 Menu</b> button!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Menu").resized()
                        })
                    break;
            }
        } else {
            switch (ctx.callbackQuery.data) {
                case "Language-Uzb":
                    await ctx.reply(`Assalomu alaykum <b>${ctx.callbackQuery.from.first_name}</b> botimizga xush kelibsiz!\n
Botdan to'liq foydalanish uchun <b>📋 Menyu</b> tugmasini bosing!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Menyu").resized()
                        })
                    break;
                case "Language-Rus":
                    await ctx.reply(`Здравствуйте, добро пожаловать в наш <b>${ctx.callbackQuery.from.first_name}</b> бот!\n
Чтобы в полной мере использовать возможности бота, нажмите кнопку <b>📋 Меню</b>!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Меню").resized()
                        })
                    break;
                case "Language-Eng":
                    await ctx.reply(`Hello <b>${ctx.callbackQuery.from.first_name}</b>, welcome to our bot!\n
To use the bot to its full potential, press the <b>📋 Menu</b> button!`,
                        {
                            parse_mode: 'HTML',
                            reply_markup: new Keyboard().text("📋 Menu").resized()
                        })
                    break;
            }
        }
    }
})

bot.on('message:web_app_data', async (ctx) => {
    if (!ctx.message?.web_app_data?.data) {
        return console.log("Ma'lumot kelmadi!");
    }
    
    try {
        const data = JSON.parse(ctx.message.web_app_data.data);
        console.log("Ma'lumotlar:", data);
    } catch (error) {
        console.error("JSON parse xatosi:", error);
    }
});


bot.on("callback_query", async (ctx) => {
    const user = await userModel.findOne({ chatId: ctx.callbackQuery.from.id })

    if (user.language === "Language-Uzb") {
        await uzDoctorsQuery(ctx)
        await uzPriceQuery(ctx)
    } else if (user.language === "Language-Rus") {
        await ruDoctorsQuery(ctx)
        await ruPriceQuery(ctx)
    } else if (user.language === "Language-Eng") {
        await enDoctorsQuery(ctx)
        await enPriceQuery(ctx)
    }
});

exports.runBot = () => {
    bot.start();
    console.log('Bot ishga tushdi...');
};  
