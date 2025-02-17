const { enDoctors } = require("./enDoctors");
const { uzMenyu, ruMenyu, enMenyu } = require("./menyuKeyboard");
const { ruDoctors } = require("./ruDoctors");
const { uzDoctors } = require("./uzDoctors");

exports.Menyu = async (text, ctx) => {
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
            await Service(ctx);
            break;
        case "💵  Tahlil narxlari":
            await Sections(ctx);
            break;
        case "🧬  Tahlil natijasi":
            await Result(ctx);
            break;
        default:
            await ctx.reply("📌 Iltimos, menyudagi tugmalardan foydalaning.");
            break;
    }
}