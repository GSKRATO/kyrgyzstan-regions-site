// 1. ВСТАВЬТЕ СВОЙ ТОКЕН ТУТ (в кавычках)
const HF_TOKEN = "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"; 

const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        description: "Иссык-Кульская область — это настоящая жемчужина и туристическое сердце Кыргызстана...",
        touristInfo: "Летом побережье озера становится идеальным местом для пляжного отдыха...",
        image: "issyk-kul.jpg"
    },
    "chuy": {
        name: "Чуйская область",
        description: "Чуйская область является самым развитым и густонаселенным регионом страны...",
        touristInfo: "Начните свое путешествие с Бишкека, чтобы прочувствовать ритм жизни...",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
    },
    "osh": {
        name: "Ошская область",
        description: "Ошская область — это колоритный южный регион с 3000-летней историей...",
        touristInfo: "Сердцем региона является священная гора Сулайман-Тоо...",
        image: "osh.jpg"
    },
    "naryn": {
        name: "Нарынская область",
        description: "Самый высокогорный край настоящих кочевников...",
        touristInfo: "Главный магнит — озеро Сон-Куль и караван-сарай Таш-Рабат.",
        image: "naryn.jpg"
    },
    "jalal-abad": {
        name: "Джалал-Абадская область",
        description: "Край реликтовых ореховых лесов и минеральных источников...",
        touristInfo: "Посетите Сары-Челек и крупнейший лес Арсланбоб.",
        image: "jalal-abad.jpg"
    },
    "talas": {
        name: "Таласская область",
        description: "Земля, связанная с легендарным богатырем Манасом...",
        touristInfo: "Посетите кумбез Манас-Ордо и ущелье Беш-Таш.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    },
    "batken": {
        name: "Баткенская область",
        description: "Самый загадочный регион, край абрикосов и цветка Айгуль...",
        touristInfo: "Исследуйте пещеры и попробуйте сладкий баткенский урюк.",
        image: "batken.jpg"
    }
};

const infoContent = document.getElementById('info-content');
const audioControls = document.getElementById('audio-controls');
const btnSpeak = document.getElementById('btn-speak');
const aiStatus = document.getElementById('ai-status');
const player = document.getElementById('tts-player');

let currentText = "";

// Функция для озвучки через Hugging Face
async function speak(text) {
    aiStatus.innerText = "⏳ Готовлю голос...";
    btnSpeak.disabled = true;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/mms-tts-kir",
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}` },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        player.src = url;
        player.play();
        aiStatus.innerText = "▶️ Воспроизведение";
    } catch (err) {
        aiStatus.innerText = "❌ Ошибка озвучки";
        console.error(err);
    } finally {
        btnSpeak.disabled = false;
    }
}

// Обработка клика по пину
document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
        const regionKey = e.currentTarget.getAttribute('data-region');
        const data = regionsData[regionKey];

        if (data) {
            currentText = `${data.name}. ${data.description}`;
            
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <img src="${data.image}" alt="${data.name}" onerror="this.src='https://via.placeholder.com/800x400?text=Фото+в+пути'">
                    <p><strong>О регионе:</strong> ${data.description}</p>
                    <p style="margin-top:10px"><strong>Для туристов:</strong> ${data.touristInfo}</p>
                </div>
            `;

            audioControls.style.display = "block";
            aiStatus.innerText = "";
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Кнопка прослушивания
btnSpeak.addEventListener('click', () => {
    if (currentText) speak(currentText);
});

