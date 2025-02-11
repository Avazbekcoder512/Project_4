function sendDataToBot() {
    const orderNumber = document.getElementById("orderNumber")?.value.trim();
    const verificationCode = document.getElementById("verificationCode")?.value.trim();
    
    if (!orderNumber || !verificationCode) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    const data = { orderNumber, verificationCode };

    if (window.Telegram?.WebApp) {
        try {
            console.log("Yuborilayotgan ma'lumot:", data);
            window.Telegram.WebApp.sendData(JSON.stringify(data));
            window.Telegram.WebApp.close();
        } catch (error) {
            console.error("Telegram Web App orqali ma'lumot yuborishda xatolik:", error);
            alert("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring!");
        }
    } else {
        alert("Telegram Web App xatosi. Iltimos, Telegram ilovasi orqali urinib ko'ring!");
    }
}
