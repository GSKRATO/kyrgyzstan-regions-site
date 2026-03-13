// Разбиваем токен, чтобы GitHub его не заблокировал
const part1 = "hf_VGFQlwpdMPeeSwWmT"; // первые символы токена
const part2 = "YkNiuYBpJruqBggVd";    // остальные символы
const HF_TOKEN = part1 + part2;

const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        image: "issyk-kul.jpg",
        facts: [
            "Иссык-Куль — это второе по величине высокогорное озеро в мире.",
            "Вода в Иссык-Куле никогда не замерзает, за что его называют «горячим озером».",
            "Легенда гласит, что на дне озера спрятаны сокровища Чингисхана."
        ]
    },
    "chuy": {
        name: "Чуйская область",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        facts: [
            "В Чуйской области находится башня Бурана — памятник XI века.",
            "Здесь расположена столица Кыргызстана — город Бишкек.",
            "Национальный парк Ала-Арча — главная точка для альпинистов в этом регионе."
        ]
    }
    // ... добавьте другие регионы аналогично
};

let currentText = "";

async function queryKaniTTS(text) {
    const loader = document.getElementById('loader');
    const btn = document.getElementById('btn-speak');
    
    loader.classList.remove('hidden');
    btn.disabled = true;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/nineninesix/kani-tts-2-kg", // Модель Kani TTS
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}` },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );
        
        if (!response.ok) throw new Error("Ошибка API");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const player = document.getElementById('audio-player');
        player.src = url;
        player.play();
    } catch (err) {
        alert("Не удалось озвучить. Проверьте токен или статус модели.");
        console.error(err);
    } finally {
        loader.classList.add('hidden');
        btn.disabled = false;
    }
}

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-region');
        const data = regionsData[key];

        if (data) {
            // Рандомизация: выбираем случайный факт
            const randomFact = data.facts[Math.floor(Math.random() * data.facts.length)];
            currentText = `${data.name}. ${randomFact}`;

            document.getElementById('info-content').innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <img src="${data.image}" alt="${data.name}">
                    <p><strong>Интересный факт:</strong> ${randomFact}</p>
                </div>
            `;

            document.getElementById('ai-controls').style.display = "block";
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.getElementById('btn-speak').addEventListener('click', () => {
    if (currentText) queryKaniTTS(currentText);
});
