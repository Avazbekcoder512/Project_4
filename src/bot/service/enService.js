const { serviceModel } = require("../../models/serviceModel");

exports.enService = async (ctx) => {
    try {
        const result = await serviceModel.find();

        if (!result.length) {
            return ctx.reply('🙅‍♂️  Services not found!');
        }

        let text = `<b>List of services</b>\n\n`;

        result.forEach((service, index) => {
            text += `🔹 <b>${index + 1}.</b> <b>${service.en_name}</b> - ${service.en_title}\n`;
        });

        await ctx.reply(text, {
            parse_mode: "HTML" 
        });
    } catch (error) {
        console.log(error);
        ctx.reply('🆘  Server error!');
    }
};