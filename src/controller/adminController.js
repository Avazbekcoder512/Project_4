const { adminModel } = require("../models/adminModel");
const { validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcrypt')
require("dotenv").config();
const { createClient } = require('@supabase/supabase-js')

// Supabase clientni sozlash
const supabase = createClient(
  process.env.Supabase_URL,
  process.env.Supabase_KEY,
);

// Admin yaratish
exports.createAdmin = async (req, res) => {
  try {
    // error bilan ishlash
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: errors.array().map((error) => error.msg),
      });
    }
    const data = matchedData(req);

    // Usernameni tekshirish
    const condidat = await adminModel.findOne({ username: data.username })
    if (condidat) {
      return res.status(400).send({
        error: "Bunday foydalanuvchi nomi allaqachon bor!"
      })
    }

    // Parolni hashlash
    const passwordHash = await bcrypt.hash(data.password, 10)
    delete data.password

    const admin = await adminModel.create({
      name: data.name,
      username: data.username,
      password: passwordHash,
      gender: data.gender,
      email: data.email,
      role: data.role
    });

    return res.status(200).send({
      message: "Admin muvaffaqiyatli yaratildi!",
      admin
    });

  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        error: error.message,
      });
    }
    return res.status(500).send("Serverda xatolik!");
  }
};

// Hamma adminlarni ko'rish
exports.getAllAdmin = async (req, res) => {
  try {
    const admins = await adminModel.find();

    if (!admins) {
      return res.status(400).send("Adminlar topilmadi!");
    }

    return res.status(200).send({
      message: "Adminlar ro'yxati!",
      admins
    });
  } catch (error) {
    console.log(error);
    if (error.message) {
      return res.status(400).send({
        error: error.message,
      });
    }
    return res.status(500).send("Serverda xatolik!");
  }
};

// Adminni o'chirish
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        error: "Invalid ID format!"
      });
    }

    const admin = await adminModel.findById(id);
    if (!admin) {
      return res.status(404).send({
        error: "Admin not found!"
      });
    }
    
    await adminModel.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Admin deleted successfully!"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: error.message || "An error occurred while deleting the admin!"
    });
  }
};



