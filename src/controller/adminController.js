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

    if (!req.file) {
      return res.status(400).send({
        error: "Iltimos, rasm faylni yuklang!",
      });
    }

    // Rasm hajmini tekshirish (maksimal 2 MB)
    const maxFileSize = 2 * 1024 * 1024; // 2 MB
    if (req.file.size > maxFileSize) {
      return res.status(400).send({
        error: "Rasm hajmi 2 MB dan oshmasligi kerak!",
      });
    }

    // Faylni Supabase storagega yuklash
    const { buffer, originalname } = req.file;
    const fileName = `admins/${Date.now()}-${originalname}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("Images") // Bu yerda bucket nomini yozing
      .upload(fileName, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
    }

    const fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;

    // Parolni hashlash
    const passwordHash = await bcrypt.hash(data.password, 10)
    delete data.password

    const admin = await adminModel.create({
      name: data.name,
      username: data.username,
      password: passwordHash,
      gender: data.gender,
      email: data.email,
      role: data.role,
      image: fileUrl 
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

    const fileUrl = admin.image

    if (fileUrl) {
      const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/Images/`, '');

      // Faylning mavjudligini tekshirish
      const { data: fileExists, error: checkError } = await supabase
        .storage
        .from('Images')
        .list('', { prefix: filePath });

      if (checkError) {
        console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
      } else if (fileExists && fileExists.length > 0) {
        // Faylni o‘chirish
        const { error: deleteError } = await supabase
          .storage
          .from('Images')
          .remove([filePath]);

        if (deleteError) {
          throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
        }
      }
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