
const pickMap = L.map("pick-map").setView([-25.3905, -51.4628], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(pickMap);

let selected = null;
let marker = null;

pickMap.on("click", event => {

    selected = {
        lat: event.latlng.lat,
        lng: event.latlng.lng
    };

    if (marker) {
        pickMap.removeLayer(marker);
    }

    marker = L.marker(event.latlng).addTo(pickMap);

    document.getElementById("coordinates").textContent =
        `Latitude: ${selected.lat.toFixed(6)} | Longitude: ${selected.lng.toFixed(6)}`;
});

document.getElementById("point-form").addEventListener("submit", event => {

    event.preventDefault();

    const message = document.getElementById("form-message");

    if (!localStorage.getItem("ledpedestre_session")) {
        message.textContent = "Faça login antes de registrar um ponto.";
        return;
    }

    if (!selected) {
        message.textContent = "Selecione uma localização no mapa.";
        return;
    }

    const points = JSON.parse(
        localStorage.getItem("ledpedestre_points") || "[]"
    );

    points.push({
        id: Date.now(),
        address: document.getElementById("address").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value,
        lat: selected.lat,
        lng: selected.lng
    });

    localStorage.setItem(
        "ledpedestre_points",
        JSON.stringify(points)
    );

    message.textContent = "Ponto registrado com sucesso!";
    message.style.color = "green";

    event.target.reset();
    selected = null;

    if (marker) {
        pickMap.removeLayer(marker);
        marker = null;
    }

    document.getElementById("coordinates").textContent = "";
});