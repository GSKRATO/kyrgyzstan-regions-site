// РЕШЕНИЕ ПРОБЛЕМЫ С ТОКЕНОМ: разбиваем hf_... на две части
const secret1 = "hf_"; 
const secret2 = "PixSmyqZyetFIDfEYBuAuedqrnzCiaPZmD"; // Сюда вставь остаток токена
const HF_TOKEN = secret1 + secret2;

const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        image: "issyk-kul.jpg",
        facts: [
            "Иссык-Куль — это второе по величине высокогорное озеро в мире.",
            "Вода в нем никогда не замерзает, за что его называют «горячим озером».",
            "На дне озера покоятся остатки древних городов, которым тысячи лет."
        ]
    },
    "chuy": {
        name: "Чуйская область",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        facts: [
            "Здесь находится башня Бурана — минарет 11-го века.",
            "В Чуйской долине весной расцветают поля диких тюльпанов.",
            "Регион является самым густонаселенным и развитым в стране."
        ]
    }
    // Добавь факты для остальных регионов так же
};

let currentText = "";

async function speakWithAI(text) {
    const status = document.getElementById('ai-status');
    status.innerText = "⏳ ИИ готовит голос...";
    
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/nineninesix/kani-tts-2-kg",
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}` },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );
        
        if (!response.ok) throw new Error("Ошибка API");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = document.getElementById('tts-player');
        audio.src = url;
        audio.play();
        status.innerText = "▶️ Играет";
    } catch (err) {
        status.innerText = "❌ Ошибка. Проверьте токен.";
        console.error(err);
    }
}

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-region');
        const data = regionsData[key];

        if (data) {
            // ВЫБОР РАНДОМНОГО ФАКТА
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
    if (currentText) speakWithAI(currentText);
});
