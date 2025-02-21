document.addEventListener("DOMContentLoaded", async function () {
    const regionSelect = document.getElementById("region");
    const districtSelect = document.getElementById("district");
    const quarterSelect = document.getElementById("quarter");
    const serviceSelect = document.getElementById("service");

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
    
    // Formani yuborish
    document.getElementById("registerForm").addEventListener("click", (event) => {
        event.preventDefault();

        let formData = {
            fio: document.getElementById("fio").value,
            birthdate: document.getElementById("birthdate").value,
            gender: document.getElementById("gender").value,
            region: regionSelect.options[regionSelect.selectedIndex].text,
            district: districtSelect.options[districtSelect.selectedIndex]?.text || "",
            quarter: quarterSelect.options[quarterSelect.selectedIndex]?.text || "",
            street: document.getElementById("street").value,
            house: document.getElementById("house").value,
            service: serviceSelect.options[serviceSelect.selectedIndex].text,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        };

        // Ma'lumotlarni Telegram botga yuborish
        Telegram.WebApp.sendData(JSON.stringify(formData));
    });
});
