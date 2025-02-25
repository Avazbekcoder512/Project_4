exports.createPatientSchema = {
  name: {
    isString: { errorMessage: "F.I.Sh  string bo'lishi kerak!" },
    notEmpty: { errorMessage: "F.I.Sh talab qilinadi!" },
  },
  date_of_birth: {
    isString: { errorMessage: "Tu'g'ilgan kun string bo'lishi kerak!" },
    notEmpty: { errorMessage: "Tu'g'ilgan kun talab qilinadi!" },
    custom: {
      options: (value) => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(value)) {
          throw new Error(
            "Tu'g'ilgan kun noto'g'ri formatda. DD-MM-YYYY formatida bo'lishi kerak!"
          );
        }

        const [day, month, year] = value.split("-").map(Number);
        const isValidDate = !isNaN(new Date(year, month - 1, day).getTime());
        if (!isValidDate || day < 1 || day > 31 || month < 1 || month > 12 || 1910 > year) {
          throw new Error("Tu'g'ilgan kun haqiqiy sana emas!");
        }
        return true;
      },
    },
  },
  gender: {
    isString: { errorMessage: "Gender string bo'lishi kerak!" },
    notEmpty: { errorMessage: "Gender talab qilinadi!" },
  },

  email: {
    isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" },
    notEmpty: { errorMessage: "Elektron pochta manzili talab qilinadi!" },
  },

  orderNumber: {
    isInt: { errorMessage: "Tartib raqami son bo'lishi kerak!" },
    notEmpty: { errorMessage: "Tartib raqami talab qilinadi!" },
  },
};

exports.updatePateintSchema = {
  name: { isString: { errorMessage: "F.I.Sh  string bo'lishi kerak!" } },
  date_of_birth: {
    isString: { errorMessage: "Tu'g'ilgan kun string bo'lishi kerak!" },
    notEmpty: { errorMessage: "Tu'g'ilgan kun talab qilinadi!" },
    custom: {
      options: (value) => {
        const regex = /^\d{2}-\d{2}-\d{4}$/;
        if (!regex.test(value)) {
          throw new Error(
            "Tu'g'ilgan kun noto'g'ri formatda. DD-MM-YYYY formatida bo'lishi kerak!"
          );
        }

        const [day, month, year] = value.split("-").map(Number);
        const isValidDate = !isNaN(new Date(year, month - 1, day).getTime());
        if (!isValidDate || day < 1 || day > 31 || month < 1 || month > 12 || 1910 > year) {
          throw new Error("Tu'g'ilgan kun haqiqiy sana emas!");
        }
        return true;
      },
    },
  },
  gender: { isString: { errorMessage: "Gender string bo'lishi kerak!" } },

  email: { isEmail: { errorMessage: "Elektron pochta manzili yaroqsiz!" } },
  orderNumber: {
    isInt: { errorMessage: "Tartib raqami son bo'lishi kerak!" }
  },
};