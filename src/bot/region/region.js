const fs = require('fs');
const { InlineKeyboard } = require('grammy');
const { patientModel } = require('../../models/patientModel');
const { serviceModel } = require('../../models/serviceModel');
const data = JSON.parse(fs.readFileSync("regions.json", "utf-8"));

exports.sendDistricts = async (ctx, regionId, page, update = false) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })
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

    if (user.language === "Language-Uzb") {
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
    } else if (user.language === "Language-Rus") {
        if (districts.length > pageSize) {
            districtKeyboard.row();
            if (page > 0) districtKeyboard.text("⏪ Назад", `districts_${regionId}_${page - 1}`);
            if (page < totalPages - 1) districtKeyboard.text("Следующий ⏩", `districts_${regionId}_${page + 1}`);
        }

        districtKeyboard.row();
        districtKeyboard.text("Провинции", "regions");

        const messageText = "🏙 Выберите город или район:";

        if (update) {
            await ctx.editMessageText(messageText, {
                reply_markup: districtKeyboard,
            });
        } else {
            await ctx.reply(messageText, {
                reply_markup: districtKeyboard,
            });
        }
    } else if (user.language === "Language-Eng") {
        if (districts.length > pageSize) {
            districtKeyboard.row();
            if (page > 0) districtKeyboard.text("⏪ Back", `districts_${regionId}_${page - 1}`);
            if (page < totalPages - 1) districtKeyboard.text("Next ⏩", `districts_${regionId}_${page + 1}`);
        }

        districtKeyboard.row();
        districtKeyboard.text("Provinces", "regions");

        const messageText = "🏙 Select City or District:";

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
}

exports.sendQuarters = async (ctx, districtId, page, update = false) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })
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

    if (user.language === "Language-Uzb") {
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
    } else if (user.language === "Language-Rus") {
        if (quarters.length > pageSize) {
            quartersKeyboard.row();
            if (page > 0) quartersKeyboard.text("⏪ Назад", `quarters_${districtId}_${page - 1}`);
            if (page < totalPages - 1) quartersKeyboard.text("Следующий ⏩", `quarters_${districtId}_${page + 1}`);
        }

        const selectedDistrict = data.districts.find(d => Number(d.id) === Number(districtId));
        if (selectedDistrict) {
            const regionId = selectedDistrict.region_id;
            quartersKeyboard.row();
            quartersKeyboard.text("Районы", `backtodistricts_${regionId}`);
        }

        const messageText = "🏡 Выберите район:";

        if (update) {
            await ctx.editMessageText(messageText, {
                reply_markup: quartersKeyboard,
            });
        } else {
            await ctx.reply(messageText, {
                reply_markup: quartersKeyboard,
            });
        }
    } else if (user.language === "Language-Eng") {
        if (quarters.length > pageSize) {
            quartersKeyboard.row();
            if (page > 0) quartersKeyboard.text("⏪ Back", `quarters_${districtId}_${page - 1}`);
            if (page < totalPages - 1) quartersKeyboard.text("Next ⏩", `quarters_${districtId}_${page + 1}`);
        }

        const selectedDistrict = data.districts.find(d => Number(d.id) === Number(districtId));
        if (selectedDistrict) {
            const regionId = selectedDistrict.region_id;
            quartersKeyboard.row();
            quartersKeyboard.text("Districts", `backtodistricts_${regionId}`);
        }

        const messageText = "🏡 Select a neighborhood:";

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

}

exports.sendServices = async (ctx, page, update = false) => {
    const user = await patientModel.findOne({ chatId: ctx.from.id })
    let services;
    try {
        services = await serviceModel.find({});

        const pageSize = 5;
        const totalPages = Math.ceil(services.length / pageSize);
        const start = page * pageSize;
        const end = start + pageSize;
        const paginatedServices = services.slice(start, end);

        const servicesKeyboard = new InlineKeyboard();
        paginatedServices.forEach((service, index) => {
            if (index % 2 === 0) servicesKeyboard.row();
            servicesKeyboard.text(service.uz_name, `service_${service._id}`);
        });

        if (user.language === "Language-Uzb") {
            if (services.length > pageSize) {
                servicesKeyboard.row();
                if (page > 0) servicesKeyboard.text("⏪ Orqaga", `services_${page - 1}`);
                if (page < totalPages - 1) servicesKeyboard.text("Keyingi ⏩", `services_${page + 1}`);
            }

            servicesKeyboard.row();

            const messageText = "Xizmatni tanlang:";

            if (update) {
                await ctx.editMessageText(messageText, {
                    reply_markup: servicesKeyboard,
                });
            } else {
                await ctx.reply(messageText, {
                    reply_markup: servicesKeyboard,
                });
            }
        } else if (user.language === "Language-Rus") {
            if (services.length > pageSize) {
                servicesKeyboard.row();
                if (page > 0) servicesKeyboard.text("⏪ Назад", `services_${page - 1}`);
                if (page < totalPages - 1) servicesKeyboard.text("Следующий ⏩", `services_${page + 1}`);
            }

            servicesKeyboard.row();

            const messageText = "Выберите услугу:";

            if (update) {
                await ctx.editMessageText(messageText, {
                    reply_markup: servicesKeyboard,
                });
            } else {
                await ctx.reply(messageText, {
                    reply_markup: servicesKeyboard,
                });
            }
        } else if (user.language === "Language-Eng") {
            if (services.length > pageSize) {
                servicesKeyboard.row();
                if (page > 0) servicesKeyboard.text("⏪ Back", `services_${page - 1}`);
                if (page < totalPages - 1) servicesKeyboard.text("Next ⏩", `services_${page + 1}`);
            }

            servicesKeyboard.row();

            const messageText = "Select service:";

            if (update) {
                await ctx.editMessageText(messageText, {
                    reply_markup: servicesKeyboard,
                });
            } else {
                await ctx.reply(messageText, {
                    reply_markup: servicesKeyboard,
                });
            }
        }
    } catch (err) {
        console.error("Xizmatlarni olishda xatolik:", err);
        return await ctx.reply("Xizmatlar ro'yxatini olishda xatolik yuz berdi!");
    }
}