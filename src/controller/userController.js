const { validationResult, matchedData } = require("express-validator");
const { patientModel } = require("../models/patientModel");
const { userModel } = require("../models/usersModel");


exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find()

        if (!users.length) {
            return res.status(404).send({
                error: "Userlar mavjud emas!"
            })
        }

        return res.status(200).send({
            users
        })
    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).send({ error: "Serverda xatolik!" });
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const { params: { id } } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).send({
                error: "User topilmadi"
            })
        }

        return res.status(200).send({
            user
        })
    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).send({ error: "Serverda xatolik!" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { params: { id } } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const user = await userModel.findById(id)

        // error bilan ishlash
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({
            error: errors.array().map((error) => error.msg),
          });
        }
        const data = matchedData(req);


        if (!user) {
            return res.status(404).send({
                error: "User topilmadi!"
            })
        }

        await patientModel.create({
            name: user.name,
            region: user.region,
            district: user.district,
            quarter: user.quarter,
            street: user.street,
            house: user.house,
            date_of_birth: user.date_of_birth,
            gender: user.gender,
            phoneNomber: user.phoneNomber,
            email: user.email,
            service: user.service,
            orderNumber: data.orderNumber
        })

        await userModel.findByIdAndDelete(id)

        return res.status(201).send({
            message: "Foydalanuvchi bemorlar ro'yhatiga o'tkazildi!"
        })

    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).send({ error: "Serverda xatolik!" });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { params: { id } } = req;

        // Checking id to valid.
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "ID haqiqiy emas!",
            });
        }

        const user = await userModel.findById(id)

        if (!user) {
            return res.status(404).send({
                error: "User topilmadi!"
            })
        }

        await userModel.findByIdAndDelete(id)

        return res.status(200).send({ message: "User muvaffaqiyatli o'chirildi!" })
    } catch (error) {
        console.error("Xatolik:", error);
        res.status(500).send({ error: "Serverda xatolik!" });
    }
}