
const map = L.map("map").setView([-25.3905, -51.4628], 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

const samplePoints = [
    {
        address: "Ponto demonstrativo 1",
        status: "com",
        lat: -25.3905,
        lng: -51.4628
    },
    {
        address: "Ponto demonstrativo 2",
        status: "sem",
        lat: -25.3960,
        lng: -51.4550
    },
    {
        address: "Ponto demonstrativo 3",
        status: "verificar",
        lat: -25.3845,
        lng: -51.4700
    }
];

function getPoints() {
    const saved = JSON.parse(
        localStorage.getItem("ledpedestre_points") || "[]"
    );

    return [...samplePoints, ...saved];
}

let markers = [];

function renderPoints() {

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const filter = document.getElementById("filter-status").value;

    const points = getPoints().filter(point =>
        filter === "todos" || point.status === filter
    );

    points.forEach(point => {

        const color =
            point.status === "com" ? "green" :
            point.status === "sem" ? "red" : "orange";

        const marker = L.circleMarker(
            [point.lat, point.lng],
            {
                radius: 9,
                color: color,
                fillColor: color,
                fillOpacity: 0.9
            }
        ).addTo(map);

        marker.bindPopup(`
            <strong>${point.address}</strong><br>
            Situação: ${point.status}
        `);

        markers.push(marker);
    });

    document.getElementById("point-count").textContent =
        points.length + " ponto(s) encontrado(s)";
}

document.getElementById("filter-status")
    .addEventListener("change", renderPoints);

renderPoints();