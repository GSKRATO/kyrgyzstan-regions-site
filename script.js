const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        description: "Жемчужина Кыргызстана. Здесь находится одно из самых глубоких и чистых озер в мире, окруженное хребтами Тянь-Шаня.",
        touristInfo: "Идеально для пляжного отдыха летом и горнолыжного спорта зимой в Караколе. Обязательно попробуйте ашлян-фу!",
        image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&auto=format&fit=crop"
    },
    "chuy": {
        name: "Чуйская область",
        description: "Экономический, культурный и политический центр страны. Здесь расположена столица — Бишкек.",
        touristInfo: "Посетите национальный парк Ала-Арча для хайкинга и древнюю башню Бурана на Шелковом пути.",
        image: "https://images.unsplash.com/photo-1627993070116-c3cc5b1d5d36?w=800&auto=format&fit=crop"
    },
    "osh": {
        name: "Ошская область",
        description: "Южная столица с историей в 3000 лет. Отличается колоритом, теплым климатом и потрясающей ферганской кухней.",
        touristInfo: "Главная достопримечательность — священная гора Сулайман-Тоо, внесенная в список ЮНЕСКО.",
        image: "https://images.unsplash.com/photo-1634591461413-eb89d9e6022e?w=800&auto=format&fit=crop"
    }
    // Здесь позже можно добавить Нарын, Джалал-Абад, Талас и Баткен
};

document.querySelectorAll('.region-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const regionKey = e.target.getAttribute('data-region');
        const data = regionsData[regionKey];
        const infoContent = document.getElementById('info-content');

        if (data) {
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <p><strong>О регионе:</strong> ${data.description}</p>
                    <p><strong>Для туристов:</strong> ${data.touristInfo}</p>
                    <img src="${data.image}" alt="Фотография ${data.name}">
                </div>
            `;
        } else {
            infoContent.innerHTML = `<p>Информация об этом регионе скоро будет добавлена!</p>`;
        }
    });
});
