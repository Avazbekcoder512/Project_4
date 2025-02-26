const { Bot, session, Keyboard, InlineKeyboard } = require('grammy');
const { commands } = require('./commands');
const { uzDoctorsQuery } = require('./doctors/uzDoctors');
const { uzResult } = require('./result/uzResult');
const { Menyu } = require('./menu');
const { ruDoctorsQuery } = require('./doctors/ruDoctors');
const { enDoctorsQuery } = require('./doctors/enDoctors');
const { uzPriceQuery } = require('./price/uzPrice');
const { ruPriceQuery } = require('./price/ruPrice');
const { enPriceQuery } = require('./price/enPrice');
const { ruResult } = require('./result/ruResult');
const { enResult } = require('./result/enResult');
const { patientModel } = require('../models/patientModel');
const { askNextStep } = require('./registration');
require('dotenv').config();
const fs = require('fs')

const bot = new Bot(process.env.BOT_TOKEN);

const data = JSON.parse(fs.readFileSync("regions.json", "utf-8"));

bot.use(session({ initial: () => ({ step: 0, phone: "", region: "", district: "" }) }));

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateString) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01]).(0[1-9]|1[0-2]).(\d{4})$/;

    if (!dateRegex.test(dateString)) {
        return { valid: false, message: "❌ Tug‘ilgan kunni DD-MM-YYYY formatida kiriting! (Masalan: 15-08-1995)" };
    }

    const [day, month, year] = dateString.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);

    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);

    if (birthDate > today) {
        return { valid: false, message: "❌ Tug‘ilgan kun bugundan keyin bo‘lishi mumkin emas!" };
    }

    if (birthDate < hundredYearsAgo) {
        return { valid: false, message: "❌ Tug‘ilgan kun oxirgi 100 yil ichida bo‘lishi kerak!" };
    }

    return { valid: true };
}

bot.api.setMyCommands([
    { command: 'start', description: 'Botni ishga tushirish! / Запустите бота! / Launch the bot!' },
    { command: 'lang', description: "Tilni o'zgartirish! / Изменить язык! / Change language!" },
    { command: 'info', description: "Bot haqida ma'lumot! / Информация о боте! / Bot information!" },
    { command: 'social_networks', description: "Bizga obuna bo'ling! / Подпишитесь на нас! / Subscribe to us!" }
]);

commands(bot);

bot.on("message:text", async (ctx) => {
    const userInput = ctx.message.text
    const user = await patientModel.findOne({ chatId: ctx.chat.id })
    if (!user) {
        await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
    }

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

    if (user.step === 1) {
        user.name = userInput
        user.step = 2
    } else if (user.step === 2) {
        const dataCheck = isValidDate(userInput)
        if (!dataCheck.valid) {
            return await ctx.reply(dataCheck.message)
        }
        user.date_of_birth = userInput
        user.step = 3
    } else if (user.step === 3) {
        if (!isValidEmail(userInput)) {
            return await ctx.reply("❌ Email noto‘g‘ri! Iltimos, qayta kiriting: (masalan: user@example.com)")
        }
        user.email = userInput
        user.step = 4
    } else if (user.step === 5) {
        user.address = userInput
        user.step = 6
    } else if (user.step === 6) {
        user.step = 0
    }

    await user.save();
    await askNextStep(ctx, user);
});

bot.callbackQuery(/\bLanguage-(Uzb|Rus|Eng)\b/, async (ctx) => {
    const user = await patientModel.findOne({ chatId: ctx.callbackQuery.from.id })

    if (!user) {
        await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
    }

    await ctx.answerCallbackQuery();
    await ctx.deleteMessage()
    if (user.language) {
        await patientModel.findByIdAndUpdate(user.id, { language: ctx.callbackQuery.data }, { new: true })
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
        await patientModel.findByIdAndUpdate(user.id, { language: ctx.callbackQuery.data }, { new: true })
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

bot.on('message:contact', async (ctx) => {
    const userId = ctx.from.id
    const contact = ctx.message.contact

    let user = await patientModel.findOne({ chatId: userId })

    if (!user) {
        await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
    }

    if (!contact) {
        await ctx.reply('Iltimos pastdagi Telefon raqamni yuborish tugmasi orqali yuboring')
    }

    user.phoneNomber = contact.phone_number
    await user.save()

    const regionKeyboards = new InlineKeyboard();

    data.regions.forEach((region, index) => {
        if (index % 2 === 0) regionKeyboards.row();
        regionKeyboards.text(region.name, `region_${region.id}`);
    });

    await ctx.reply("🌍 Viloyatingizni tanlang:", {
        reply_markup: regionKeyboards,
    });
})

bot.callbackQuery(/^region_(\d+)$/, async (ctx) => {
    const regionId = ctx.match[1];
    
    const userId = ctx.from.id;
    let user = await patientModel.findOne({ chatId: userId });
    if (!user) {
        return await ctx.answerCallbackQuery({
            text: "Ma'lumot topilmadi. Iltimos, /start buyrug'ini bosing!",
            show_alert: true,
        });
    }

    const selectedRegion = data.regions.find((region) => region.id == regionId);
    if (!selectedRegion) {
        return await ctx.answerCallbackQuery({
            text: "Noto'g'ri viloyat tanlandi!",
            show_alert: true,
        });
    }

    user.region = selectedRegion.name;
    await user.save();

    await ctx.answerCallbackQuery();
    await sendDistricts(ctx, regionId, 0, true);
});

async function sendDistricts(ctx, regionId, page, update = false) {    
    const districts = data.districts.filter(d => Number(d.region_id) === Number(regionId));
    
    const pageSize = 10;
    const totalPages = Math.ceil(districts.length / pageSize);
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedDistricts = districts.slice(start, end);

    const districtKeyboard = new InlineKeyboard();
    paginatedDistricts.forEach((district, index) => {
        if (index % 2 === 0) districtKeyboard.row();
        districtKeyboard.text(district.name, `district_${district.id}`);
    });

    if (districts.length > pageSize) {
        districtKeyboard.row();
        if (page > 0) districtKeyboard.text("⏪ Orqaga", `districts_${regionId}_${page - 1}`);
        if (page < totalPages - 1) districtKeyboard.text("Keyingi ⏩", `districts_${regionId}_${page + 1}`);
    }

    districtKeyboard.row();
    districtKeyboard.text("Viloyatlar", "regions");

    const messageText = "🏙 Shahar yoki Tumanni tanlang:";

    if (update) {
        await ctx.editMessageText(messageText, {
            reply_markup: districtKeyboard,
        });
    } else {
        await ctx.reply(messageText, {
            reply_markup: districtKeyboard,
        });
    }
}

bot.callbackQuery(/^districts_(\d+)_(\d+)$/, async (ctx) => {
    const regionId = ctx.match[1];
    const page = parseInt(ctx.match[2], 10);
    await ctx.answerCallbackQuery();
    await sendDistricts(ctx, regionId, page, true);
});

bot.callbackQuery("regions", async (ctx) => {
    const regionKeyboard = new InlineKeyboard();
    data.regions.forEach((region, index) => {
        if (index % 2 === 0) regionKeyboard.row();
        regionKeyboard.text(region.name, `region_${region.id}`);
    });
    await ctx.answerCallbackQuery();
    await ctx.editMessageText("🌍 Viloyatingizni tanlang:", {
        reply_markup: regionKeyboard,
    });
});

bot.callbackQuery(/^district_(\d+)$/, async (ctx) => {
    const districtId = ctx.match[1];
    const userId = ctx.from.id;
    let user = await patientModel.findOne({ chatId: userId });
    if (!user) {
        return await ctx.answerCallbackQuery({
            text: "Ma'lumot topilmadi. Iltimos, /start buyrug'ini bosing!",
            show_alert: true,
        });
    }
    const selectedDistrict = data.districts.find((district) => district.id == districtId);
    if (!selectedDistrict) {
        return await ctx.answerCallbackQuery({
            text: "Noto'g'ri tuman tanlandi!",
            show_alert: true,
        });
    }
    user.district = selectedDistrict.name;
    await user.save();
    await ctx.answerCallbackQuery();
    await sendQuarters(ctx, districtId, 0, true);
});


async function sendQuarters(ctx, districtId, page, update = false) {
    const quarters = data.quarters.filter(m => Number(m.district_id) === Number(districtId));

    const pageSize = 10;
    const totalPages = Math.ceil(quarters.length / pageSize);
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedQuarters = quarters.slice(start, end);

    const quartersKeyboard = new InlineKeyboard();
    paginatedQuarters.forEach((quarter, index) => {
        if (index % 2 === 0) quartersKeyboard.row();
        quartersKeyboard.text(quarter.name, `quarters_${quarter.id}`);
    });

    if (quarters.length > pageSize) {
        quartersKeyboard.row();
        if (page > 0) quartersKeyboard.text("⏪ Orqaga", `quarters_${districtId}_${page - 1}`);
        if (page < totalPages - 1) quartersKeyboard.text("Keyingi ⏩", `quarters_${districtId}_${page + 1}`);
    }

    const selectedDistrict = data.districts.find(d => Number(d.id) === Number(districtId));
    if (selectedDistrict) {
        const regionId = selectedDistrict.region_id;
        quartersKeyboard.row();
        quartersKeyboard.text("Tumanlar", `backtodistricts_${regionId}`);
    }

    const messageText = "🏡 Mahallani tanlang:";

    if (update) {
        await ctx.editMessageText(messageText, {
            reply_markup: quartersKeyboard,
        });
    } else {
        await ctx.reply(messageText, {
            reply_markup: quartersKeyboard,
        });
    }
}

bot.callbackQuery(/^quarters_(\d+)_(\d+)$/, async (ctx) => {
    const districtId = ctx.match[1];
    const page = parseInt(ctx.match[2], 10);
    await ctx.answerCallbackQuery();
    await sendQuarters(ctx, districtId, page, true);
});

bot.callbackQuery(/^quarters_(\d+)$/, async (ctx) => {
    const quarterId = ctx.match[1];
    const userId = ctx.from.id;

    let user = await patientModel.findOne({ chatId: userId });
    if (!user) {
        return await ctx.answerCallbackQuery({
            text: "Ma'lumot topilmadi. Iltimos, /start buyrug'ini bosing!",
            show_alert: true,
        });
    }

    const selectedQuarter = data.quarters.find((quarter) => quarter.id == quarterId);
    if (!selectedQuarter) {
        return await ctx.answerCallbackQuery({
            text: "Noto'g'ri mahalla tanlandi!",
            show_alert: true,
        });
    }

    user.quarter = selectedQuarter.name;
    user.step = 5
    await user.save();

    await ctx.answerCallbackQuery();
    await ctx.reply("🏠 Uyingizni manzilini kiriting!");
});

bot.callbackQuery(/^backtodistricts_(\d+)$/, async (ctx) => {
    const regionId = ctx.match[1];
    await ctx.answerCallbackQuery();
    await sendDistricts(ctx, regionId, 0, true);
});



bot.on("callback_query", async (ctx) => {
    
    const user = await patientModel.findOne({ chatId: ctx.callbackQuery.from.id })

    if (!user) {
        await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
    }

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