const { enDoctors } = require("./doctors/enDoctors");
const { enSections } = require("./price/enPrice");
const { enService } = require("./service/enService");
const { uzMenyu, ruMenyu, enMenyu } = require("./menyuKeyboard");
const { ruDoctors } = require("./doctors/ruDoctors");
const { ruSections } = require("./price/ruPrice");
const { ruService } = require("./service/ruService");
const { uzDoctors } = require("./doctors/uzDoctors");
const { uzSections } = require("./price/uzPrice");
const { uzService } = require("./service/uzService");
const { uzResult } = require("./result/uzResult");
const { ruResult } = require("./result/ruResult");
const { enResult } = require("./result/enResult");
const { registration } = require("./registration");
const { uzProfile, ruProfile, enProfile } = require("./profile");
const { patientModel } = require("../models/patientModel");

exports.Menyu = async (text, ctx) => {
    const user = await patientModel.findOne({chatId: ctx.from.id})
    if (user.action === "Start") {
        switch (text) {
            case "📋 Menyu":
                await uzMenyu(ctx);
                break;
            case "📋 Меню":
                await ruMenyu(ctx);
                break;
            case "📋 Menu":
                await enMenyu(ctx);
                break;
            case "🧑‍⚕️  Shifokorlar":
                await uzDoctors(ctx);
                break;
            case "🧑‍⚕️  Врачи":
                await ruDoctors(ctx);
                break;
            case "🧑‍⚕️  Doctors":
                await enDoctors(ctx);
                break;
            case "🩺  Xizmatlar":
                await uzService(ctx);
                break;
            case "🩺  Услуги":
                await ruService(ctx);
                break;
            case "🩺  Services":
                await enService(ctx);
                break;
            case "💵  Tahlil narxlari":
                await uzSections(ctx);
                break;
            case "💵  Анализ цен":
                await ruSections(ctx);
                break;
            case "💵  Analysis prices":
                await enSections(ctx);
                break;
            case "🧬  Tahlil natijasi":
                await uzResult(ctx);
                break;
            case "🧬  Результат анализа":
                await ruResult(ctx);
                break;
            case "🧬  Analysis result":
                await enResult(ctx);
                break;
            case "📝  Qabulga yozilish":
                await registration(ctx);
                break;
            case "📝  Регистрация":
                await registration(ctx);
                break;
            case "📝  Registration":
                await registration(ctx);
                break;
            case "👤  Ma'lumotlarim":
                await uzProfile(ctx);
                break;
            case "👤  Моя информация":
                await ruProfile(ctx);
                break;
            case "👤  My information":
                await enProfile(ctx);
                break;
            // default:
            //     await ctx.reply("📌 Iltimos, menyudagi tugmalardan foydalaning.");
            //     break;
        }
    }
}