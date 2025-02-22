document.addEventListener("DOMContentLoaded", async function () {
    const regionSelect = document.getElementById("region");
    const districtSelect = document.getElementById("district");
    const quarterSelect = document.getElementById("quarter");
    const serviceSelect = document.getElementById("service");
    const birthdateInput = document.getElementById("birthdate");

    const today = new Date();
    birthdateInput.setAttribute("max", today.toISOString().split("T")[0]);

    try {
        const response = await fetch("regions.json");
        const data = await response.json();

        data.regions.forEach(region => {
            let option = new Option(region.name, region.id);
            regionSelect.appendChild(option);
        });

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

        districtSelect.addEventListener("change", function () {
            quarterSelect.innerHTML = `<option value="">Mahallani tanlang</option>`;

            const selectedDistrictId = parseInt(this.value);
            const filteredQuarters = data.quarters.filter(q => q.district_id === selectedDistrictId);

            filteredQuarters.forEach(quarter => {
                let option = new Option(quarter.name, quarter.id);
                quarterSelect.appendChild(option);
            });
        });

        const serviceResponse = await fetch("services.json");
        const serviceData = await serviceResponse.json();

        serviceData.services.forEach(service => {
            let option = new Option(service.name, service.id);
            serviceSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
    }

    let tg = window.Telegram.WebApp;

    tg.expand();

    tg.MainButton.setText("Yuborish");
    tg.MainButton.show();
    tg.onEvent("mainButtonClicked", () => {
        let regionSelect = document.getElementById("region");
        let regionName = regionSelect.options[regionSelect.selectedIndex].text

        let districtSelect = document.getElementById("district");
        let districtName = districtSelect.options[districtSelect.selectedIndex].text

        let quarterSelect = document.getElementById("quarter");
        let quarterName = quarterSelect.options[quarterSelect.selectedIndex].text

        let serviceSelect = document.getElementById("service");
        let serviceName = serviceSelect.options[serviceSelect.selectedIndex].text

        let formData = {
            name: document.getElementById("fio").value,
            date_of_birth: document.getElementById("birthdate").value,
            gender: document.getElementById("gender").value,
            region: regionName,
            district: districtName,
            quarter: quarterName,
            street: document.getElementById("street").value,
            house: document.getElementById("house").value,
            service: serviceName,
            email: document.getElementById("email").value,
            phoneNomber: document.getElementById("phone").value
        };
        tg.postMessage(JSON.stringify(formData));
        tg.close()
    });
});
