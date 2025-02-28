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
const fs = require('fs');
const { serviceModel } = require('../models/serviceModel');
const { uzMenyu, ruMenyu, enMenyu } = require('./menyuKeyboard');
const { sendDistricts, sendServices, sendQuarters } = require('./region/region');

const bot = new Bot(process.env.BOT_TOKEN);

const data = JSON.parse(fs.readFileSync("regions.json", "utf-8"));

bot.use(session({ initial: () => ({ step: 0, phone: "", region: "", district: "" }) }));

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(dateString) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/;

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

    if (user.action === "Registration") {
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
            sendServices(ctx, update = false)
        }
    
        await user.save();
        await askNextStep(ctx, user);
    }
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
    if (user.language === 0) {

    }
    if (!contact) {
        await ctx.reply('Iltimos pastdagi Telefon raqamni yuborish tugmasi orqali yuboring')
    }

    user.phoneNumber = contact.phone_number
    await user.save()

    const regionKeyboards = new InlineKeyboard();

    data.regions.forEach((region, index) => {
        if (index % 2 === 0) regionKeyboards.row();
        regionKeyboards.text(region.name, `region_${region.id}`);
    });

    if (user.language === "Language-Uzb") {
        await ctx.reply("🌍 Viloyatingizni tanlang:", {
            reply_markup: regionKeyboards,
        });
    } else if (user.language === "Language-Rus") {
        await ctx.reply("🌍 Выберите свой регион:", {
            reply_markup: regionKeyboards,
        });
    } else if (user.language === "Language-Eng") {
        await ctx.reply("🌍 Select your region:", {
            reply_markup: regionKeyboards,
        });
    }
})

bot.callbackQuery("regions", async (ctx) => {
    const user = await patientModel.findOne({ chatId: ctx.callbackQuery.from.id })
    if (!user) {
        await ctx.reply(`Iltimos /start tugmasini bosib botni qayta ishga tushiring!,
Пожалуйста, перезапустите бота, нажав /start!
Please restart the bot by pressing /start!`)
    }
    const regionKeyboard = new InlineKeyboard();
    data.regions.forEach((region, index) => {
        if (index % 2 === 0) regionKeyboard.row();
        regionKeyboard.text(region.name, `region_${region.id}`);
    });
    await ctx.answerCallbackQuery();

    if (user.language === "Language-Uzb") {
        await ctx.editMessageText("🌍 Viloyatingizni tanlang:", {
            reply_markup: regionKeyboard,
        });
    } else if (user.language === "Language-Rus") {
        await ctx.editMessageText("🌍 Выберите свой регион:", {
            reply_markup: regionKeyboard,
        });
    } else if (user.language === "Language-Eng") {
        await ctx.editMessageText("🌍 Select your region:", {
            reply_markup: regionKeyboard,
        });
    }
});


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
    await ctx.deleteMessage();
    await sendDistricts(ctx, regionId, 0, false);
});

bot.callbackQuery(/^districts_(\d+)_(\d+)$/, async (ctx) => {
    const regionId = ctx.match[1];
    const page = parseInt(ctx.match[2], 10);
    await ctx.answerCallbackQuery();
    await sendDistricts(ctx, regionId, page, true);
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
    await ctx.deleteMessage();
    await sendQuarters(ctx, districtId, 0, false);
});

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
    user.step = 6;
    await user.save();

    await ctx.answerCallbackQuery();

    if (user.language === "Language-Uzb") {
        await ctx.reply("🏠 Uyingizni manzilini kiriting!");
    } else if (user.language === "Language-Rus") {
        await ctx.reply("🏠 Введите свой домашний адрес!");
    } else if (user.language === "Language-Eng") {
        await ctx.reply("🏠 Enter your home address!");
    }
});

bot.callbackQuery(/^backtodistricts_(\d+)$/, async (ctx) => {
    const regionId = ctx.match[1];
    await ctx.answerCallbackQuery();
    await ctx.deleteMessage();
    await sendDistricts(ctx, regionId, 0, false);
});

bot.callbackQuery(/^services_(\d+)$/, async (ctx) => {
    const page = parseInt(ctx.match[1], 10);
    await ctx.answerCallbackQuery();
    await sendServices(ctx, page, true);
});

bot.callbackQuery(/^service_(.+)$/, async (ctx) => {
    const serviceId = ctx.match[1];
    const userId = ctx.from.id;
    let user = await patientModel.findOne({ chatId: userId });
    if (!user) {
        return await ctx.answerCallbackQuery({
            text: "Ma'lumot topilmadi. Iltimos, /start buyrug'ini bosing!",
            show_alert: true,
        });
    }
    const selectedService = await serviceModel.findOne({ _id: serviceId });
    if (!selectedService) {
        return await ctx.answerCallbackQuery({
            text: "Noto'g'ri xizmat tanlandi!",
            show_alert: true,
        });
    }
    user.service = selectedService.uz_name;
    user.step = 7
    user.action = "Start"
    await user.save();
    await ctx.answerCallbackQuery();
    if (user.language === "Language-Uzb") {
        await ctx.reply("✅ Ma'lumotlaringiz saqlandi!")
        uzMenyu(ctx)
    } else if (user.language === "Language-Rus") {
        await ctx.reply("✅ Ваша информация сохранена!")
        ruMenyu(ctx)
    } else if (user.language === "Language-Eng") {
        await ctx.reply("✅ Your information has been saved!")
        enMenyu(ctx)
    }
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

    if (ctx.callbackQuery.data === "refresh") {
        if (user.language === "Language-Uzb") {
            await ctx.reply("Malumotlarni yangilash uchun qabulga yozilish bo'limiga o'tib qayta ma'lumotlaringizni kiriting!")
        } else if (user.language === "Language-Rus") {
            await ctx.reply("Чтобы обновить свою информацию, перейдите в раздел регистрации и повторно введите свою информацию!")
        } else if (user.language === "Language-Eng") {
            await ctx.reply("To update your information, go to the registration section and re-enter your information!")
        }
    }
});

exports.runBot = () => {
    bot.start();
    console.log('Bot ishga tushdi...');
}; 