document.addEventListener("DOMContentLoaded", async function () {
    const regionSelect = document.getElementById("region");
    const districtSelect = document.getElementById("district");
    const quarterSelect = document.getElementById("quarter");
    const serviceSelect = document.getElementById("service");
    const birthdateInput = document.getElementById("birthdate");

    // Tug‘ilgan yilning maksimal sanasini belgilash
    const today = new Date();
    birthdateInput.setAttribute("max", today.toISOString().split("T")[0]);

    try {
        // JSON fayldan viloyat, tuman va mahalla ma'lumotlarini yuklash
        const response = await fetch("regions.json");
        const data = await response.json();

        // Viloyatlarni yuklash
        data.regions.forEach(region => {
            let option = new Option(region.name, region.id);
            regionSelect.appendChild(option);
        });

        // Viloyat tanlanganda tumanlarni chiqarish
        regionSelect.addEventListener("change", function () {
            districtSelect.innerHTML = `<option value="">Tumanni tanlang</option>`;
            quarterSelect.innerHTML = `<option value="">Avval tumanni tanlang</option>`;

            const selectedRegionId = parseInt(this.value);
            const filteredDistricts = data.districts.filter(d => d.region_id === selectedRegionId);

            filteredDistricts.forEach(district => {
                let option = new Option(district.name, district.id);
                districtSelect.appendChild(option);
            });
        });

        // Tuman tanlanganda mahallalarni chiqarish
        districtSelect.addEventListener("change", function () {
            quarterSelect.innerHTML = `<option value="">Mahallani tanlang</option>`;

            const selectedDistrictId = parseInt(this.value);
            const filteredQuarters = data.quarters.filter(q => q.district_id === selectedDistrictId);

            filteredQuarters.forEach(quarter => {
                let option = new Option(quarter.name, quarter.id);
                quarterSelect.appendChild(option);
            });
        });

        // Xizmat turlarini JSON fayldan yuklash
        const serviceResponse = await fetch("services.json");
        const serviceData = await serviceResponse.json();

        serviceData.services.forEach(service => {
            let option = new Option(service.name, service.id);
            serviceSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }

    // Telegram WebApp obyekti
    let tg = window.Telegram.WebApp;

    tg.expand(); // WebApp oynasini to'liq ekran qilish

    // MainButton sozlamalari
    tg.MainButton.setText("Yuborish");
    tg.MainButton.show(); // Tugmani chiqarish

    // MainButton bosilganda ishlaydigan event
    tg.onEvent("mainButtonClicked", () => {
        let formData = {
            name: document.getElementById("fio").value,
            date_of_birth: document.getElementById("birthdate").value,
            gender: document.getElementById("gender").value,
            region: document.getElementById("region").value,
            district: document.getElementById("district").value,
            quarter: document.getElementById("quarter").value,
            street: document.getElementById("street").value,
            house: document.getElementById("house").value,
            service: document.getElementById("service").value,
            email: document.getElementById("email").value,
            phoneNomber: document.getElementById("phone").value
        };
            alert(formData)
        // Ma'lumotlarni Telegram botga JSON formatida yuborish
        tg.sendData(JSON.stringify(formData));
        setTimeout(() => tg.close(), 1000);
    });
});
