const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../../models/adminModel");
const { doctorModel } = require('../../models/doctorModel');
const { staffModel } = require("../../models/staffModel");
require("dotenv").config();

// Token generatsiya qilish
const generateToken = (id, role, gender) => {
  const payload = {
    id,
    role,
    gender
  };
  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });
};

exports.login = async (req, res) => {
  try {
    // error bilan ishlash
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: errors.array().map((error) => error.msg),
      });
    }
    const data = matchedData(req);

    // Admin user
    let user = await adminModel.findOne({ username: data.username }).lean();

    if (user) {      
      // Parol to'g'riligini tekshirish
      const checkPassword = await bcrypt.compare(data.password, user.password);
      
      if (!checkPassword) {
        return res.status(403).send({
          error: "Parol xato!",
        });
      }

      // Token generatsiya qilish
      const userId = user._id;
      const role = user.role;
      const gender = user.gender
      const token = generateToken(userId, role, gender);

      return res.status(200).send({
        message: 'Login muvvaffaqiyatli amalga oshirildi!',
        token: token
      })
    }

    // Doctor user
    user = await doctorModel.findOne({ username: data.username })

    if (user) {      
      // Parol to'g'riligini tekshirish
      const checkPassword = await bcrypt.compare(data.password, user.password);
      
      if (!checkPassword) {
        return res.status(403).send({
          error: "Parol xato!",
        });
      }

      // Token generatsiya qilish
      const userId = user._id;
      const role = user.role;
      const token = generateToken(userId, role);

      return res.status(200).send({
        message: 'Login muvvaffaqiyatli amalga oshirildi!',
        token: token
      })
    }

    // Staff user
    user = await staffModel.findOne({ username: data.username })

    if (user) {
      // Parol to'g'riligini tekshirish
      const checkPassword = await bcrypt.compare(data.password, user.password);
      if (!checkPassword) {
        return res.status(403).send({
          error: "Parol xato!",
        });
      }

      // Token generatsiya qilish
      const userId = user._id;
      const role = user.role;
      const token = generateToken(userId, role);

      return res.status(200).send({
        message: 'Login muvvaffaqiyatli amalga oshirildi!',
        token: token
      })
    }

    return res.status(404).send({ message: 'User topilmadi' })

  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        error: error.message
      })
    }
    return res.status(500).send({
      error: "Serverda xatolik!"
    })
  }
};