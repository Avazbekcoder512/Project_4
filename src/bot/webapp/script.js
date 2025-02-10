function sendDataToBot() {
    const orderNumber = document.getElementById("orderNumber").value;
    const verificationCode = document.getElementById("verificationCode").value;
    
    if (!orderNumber || !verificationCode) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    const data = { orderNumber, verificationCode };
    
    if (window.Telegram && window.Telegram.WebApp) {
        console.log("Yuborilayotgan ma'lumot:", data);
        window.Telegram.WebApp.sendData(JSON.stringify(data));
        window.Telegram.WebApp.close();
    } else {
        alert("Telegram Web App xatosi. Iltimos, qayta urinib ko'ring!");
    }
}
