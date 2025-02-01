require("dotenv").config();
const { validationResult, matchedData } = require("express-validator");
const { createClient } = require("@supabase/supabase-js");
const { doctorModel } = require("../models/doctorModel");
const bcrypt = require("bcrypt");

// Supabase clientni sozlash
const supabase = createClient(
  process.env.Supabase_URL,
  process.env.Supabase_KEY
);

// Doctor yaratish
exports.createDoctor = async (req, res) => {
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
    const condidat = await doctorModel.findOne({ username: data.username });
    if (condidat) {
      return res.status(400).send({
        error: "Bunday foydalanuvchi nomi allaqachon bor!",
      });
    }

    const phoneRegex = /^\+998\d{9}$/;

    if (!phoneRegex.test(data.phoneNumber)) {
      return res.status(400).send({ message: "Telefon raqam noto'g'ri!" });
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
    const fileName = `doctors/${Date.now()}-${originalname}`;

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
    const passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;

    const doctor = await doctorModel.create({
      uz_name: data.uz_name,
      ru_name: data.ru_name,
      en_name: data.en_name,

      username: data.username,
      password: passwordHash,

      uz_experience: data.uz_experience,
      ru_experience: data.ru_experience,
      en_experience: data.en_experience,

      uz_position: data.uz_position,
      ru_position: data.ru_position,
      en_position: data.en_position,

      uz_category: data.uz_category,
      ru_category: data.ru_category,
      en_category: data.en_category,

      uz_description: data.uz_description,
      ru_description: data.ru_description,
      en_description: data.en_description,

      gender: data.gender,
      phoneNumber: data.phoneNumber,
      image: fileUrl,
    });

    return res.status(200).send({
      message: "Doktor muvaffaqiyatli yaratildi!",
      doctor,
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

// Hamma doctorlarni ko'rish
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();

    if (!doctors) {
      return res.status(404).send({
        error: "Shifokorlar topilmadi!",
      });
    }

    return res.status(200).send({
      message: "Shifokorlar ro'yxati!",
      doctors,
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

// Bitta doctorni ko'rish
exports.getOneDoctors = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        error: "ID haqiqiy emas!",
      });
    }

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).send({
        error: "Shifikor topilmadi!",
      });
    } else {
      return res.status(200).send({
        message: "Shifokor",
        doctor,
      });
    }
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

// Doctor ma'lumotlarini yangilash
exports.updateDoctor = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    // ID ni tekshirish
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        error: "ID haqiqiy emas!",
      });
    }

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).send({
        error: "Shifikor topilmadi!",
      });
    }

    // error bilan ishlash
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: errors.array().map((error) => error.msg),
      });
    }
    const data = matchedData(req);

    const phoneRegex = /^\+998\d{9}$/;

    if (!phoneRegex.test(data.phoneNumber)) {
      return res.status(400).send({ message: "Telefon raqam noto'g'ri!" });
    }

    let fileUrl = doctor.image; // Mavjud rasmni saqlash

    if (req.file) {
      try {
        // Rasm hajmini tekshirish (maksimal 2 MB)
        const maxFileSize = 2 * 1024 * 1024; // 2 MB
        if (req.file.size > maxFileSize) {
          return res.status(400).send({
            error: "Rasm hajmi 2 MB dan oshmasligi kerak!",
          });
        }

        if (fileUrl) {
          const filePath = fileUrl.replace(
            `${supabase.storageUrl}/object/public/Images/`,
            ""
          );

          // Faylning mavjudligini tekshirish
          const { data: fileExists, error: checkError } = await supabase.storage
            .from("Images")
            .list("", { prefix: filePath });

          if (checkError) {
            console.error(
              `Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`
            );
          } else if (fileExists && fileExists.length > 0) {
            // Faylni o‘chirish
            const { error: deleteError } = await supabase.storage
              .from("Images")
              .remove([filePath]);

            if (deleteError) {
              throw new Error(
                `Faylni o'chirishda xatolik: ${deleteError.message}`
              );
            }
          }
        }

        // Yangi faylni yuklash
        const { buffer, originalname } = req.file;
        const fileName = `doctors/${Date.now()}-${originalname}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("Images")
          .upload(fileName, buffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: req.file.mimetype,
          });

        if (uploadError) {
          throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
        }

        fileUrl = `${supabase.storageUrl}/object/public/Images/${fileName}`;
      } catch (err) {
        console.error(`Faylni yangilashda xatolik: ${err.message}`);
        throw new Error(
          "Yangi faylni yuklash yoki eski faylni o‘chirishda muammo!"
        );
      }
    }

    // Doktorni yangilash
    const updateDoctor = {
      uz_name: data.uz_name || doctor.uz_name,
      ru_name: data.ru_name || doctor.ru_name,
      en_name: data.en_name || doctor.en_name,

      username: data.username || doctor.username,

      uz_experience: data.uz_experience || doctor.uz_experience,
      ru_experience: data.ru_experience || doctor.ru_experience,
      en_experience: data.en_experience || doctor.en_experience,

      uz_position: data.uz_position || doctor.uz_position,
      ru_position: data.ru_position || doctor.ru_position,
      en_position: data.en_position || doctor.en_position,

      uz_category: data.uz_category || doctor.uz_category,
      ru_category: data.ru_category || doctor.ru_category,
      en_category: data.en_category || doctor.en_category,

      uz_description: data.uz_description || doctor.uz_description,
      ru_description: data.ru_description || doctor.ru_description,
      en_description: data.en_description || doctor.en_description,

      gender: data.gender || doctor.gender,
      phoneNumber: data.phoneNumber || doctor.phoneNumber,
      image: fileUrl || doctor.image,
    };

    await doctorModel.findByIdAndUpdate(id, updateDoctor);

    return res.status(200).send({
      message: "Shifokor ma'lumotlari muvaffaqiyatli yangilandi!",
      doctor: updateDoctor,
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

// Parolni yangilash
exports.updatePassword = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    // ID ni tekshirish
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        error: "ID haqiqiy emas!",
      });
    }

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).send({
        error: "Shifikor topilmadi!",
      });
    }

    // error bilan ishlash
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        error: errors.array().map((error) => error.msg),
      });
    }
    const data = matchedData(req);

    // Parolni hashlash
    const passwordHash = await bcrypt.hash(data.password, 10);
    delete data.password;

    const updatedPassword = {
      password: passwordHash,
    };

    await doctorModel.findByIdAndUpdate(id, updatedPassword, { new: true });

    return res.status(201).send("Parol muvaffaqiyatli yangilandi!");
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

// Doctorni o'chirish
exports.deleteDoctor = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    // Checking id to valid.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        error: "ID haqiqiy emas!",
      });
    }

    const doctor = await doctorModel.findById(id);

    if (!doctor) {
      return res.status(404).send({
        error: "Shifikor topilmadi!",
      });
    }

    const fileUrl = doctor.image;

    if (fileUrl) {
      const filePath = fileUrl.replace(
        `${supabase.storageUrl}/object/public/Images/`,
        ""
      );

      // Faylning mavjudligini tekshirish
      const { data: fileExists, error: checkError } = await supabase.storage
        .from("Images")
        .list("", { prefix: filePath });

      if (checkError) {
        console.error(
          `Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`
        );
      } else if (fileExists && fileExists.length > 0) {
        // Faylni o‘chirish
        const { error: deleteError } = await supabase.storage
          .from("Images")
          .remove([filePath]);

        if (deleteError) {
          throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
        }
      }
    }

    await doctorModel.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Shifokor muvaffaqiyatli o'chirildi!",
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

// Doctorlarni qidirish
exports.searchDoctors = async (req, res) => {
  try {
    const key = req.params.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(key, 'i');
    const data = await doctorModel.find({
      $or: [
        { uz_name: { $regex: regex } },
        { ru_name: { $regex: regex } },
        { en_name: { $regex: regex } },
        { uz_position: { $regex: regex } },
        { ru_position: { $regex: regex } },
        { en_position: { $regex: regex } },
      ],
    });

    if (data.length == 0) {
      return res.status(404).send({
        message: "Shifokor mavjud emas!",
      });
    }

    return res.status(200).send({
      doctors: data,
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
