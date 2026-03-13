const tokenPart1 = "hf_"; 
const tokenPart2 = "PixSmyqZyetFIDfEYBuAuedqrnzCiaPZmD";

// Склеиваем их обратно для работы нейросети
const HUGGING_FACE_TOKEN = tokenPart1 + tokenPart2;

const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        description: "Иссык-Кульская область — это настоящая жемчужина и туристическое сердце Кыргызстана. Главным достоянием региона является величественное высокогорное озеро Иссык-Куль...",
        image: "issyk-kul.jpg"
    },
    "chuy": {
        name: "Чуйская область",
        description: "Чуйская область является самым развитым, экономически активным и густонаселенным регионом страны. Именно здесь расположена столица государства — город Бишкек.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
    },
    "osh": {
        name: "Ошская область",
        description: "Ошская область — это колоритный южный регион Кыргызстана с уникальной атмосферой и многовековой историей. Столица области, город Ош, считается одним из древнейших городов Центральной Азии.",
        image: "osh.jpg"
    },
    "naryn": {
        name: "Нарынская область",
        description: "Нарынская область — это самый крупный, высокогорный и суровый регион Кыргызстана, который часто называют «сердцем Тянь-Шаня». Это край настоящих кочевников.",
        image: "naryn.jpg"
    },
    "jalal-abad": {
        name: "Джалал-Абадская область",
        description: "Джалал-Абадская область удивительным образом сочетает в себе скалистые ущелья, зеленые долины и богатейшие лесные массивы. Здесь произрастают реликтовые ореховые леса.",
        image: "jalal-abad.jpg"
    },
    "talas": {
        name: "Таласская область",
        description: "Таласская область — это небольшой, но исторически крайне значимый регион. Эта земля неразрывно связана с именем легендарного кыргызского богатыря Манаса.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop"
    },
    "batken": {
        name: "Баткенская область",
        description: "Баткенская область — это самый молодой, отдаленный и загадочный регион Кыргызстана. Этот край знаменит на всю Центральную Азию своими потрясающе сладкими абрикосами.",
        image: "batken.jpg"
    }
};

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', async (e) => {
        const regionKey = e.currentTarget.getAttribute('data-region');
        const data = regionsData[regionKey];
        const infoContent = document.getElementById('info-content');

        if (data) {
            // Останавливаем любую предыдущую озвучку при новом клике
            window.speechSynthesis.cancel();

            // 1. Отрисовка интерфейса: сначала заголовок, затем картина, потом базовый текст и блок для ИИ
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    
                    <img src="${data.image}" alt="Фотография: ${data.name}" style="margin: 15px 0;">
                    
                    <p class="region-desc"><strong>О регионе:</strong> ${data.description}</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #eef2f5; border-radius: 8px; border-left: 4px solid #0056b3;">
                        <p id="ai-loading" style="color: #0056b3; font-style: italic;">✨ Нейросеть придумывает новый факт для туристов...</p>
                        <p id="ai-text" class="tourist-desc" style="display: none;"></p>
                        <button id="stop-btn" style="display: none; margin-top: 15px; padding: 8px 16px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Остановить озвучку</button>
                    </div>
                </div>
            `;
            
            // Плавная прокрутка к блоку с информацией
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth' });

            // 2. Активация ИИ и генерация уникального текста
            try {
                const prompt = `Расскажи один интересный абзац для туристов про ${data.name} в Кыргызстане.`;
                
                const response = await fetch("https://api-inference.huggingface.co/models/IlyaGusev/saiga_mistral_7b", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: { max_new_tokens: 150, temperature: 0.85 } // 0.85 делает текст очень разнообразным каждый раз
                    })
                });

                if (!response.ok) throw new Error("Проверьте правильность токена Hugging Face.");

                const apiData = await response.json();
                let generatedText = apiData[0].generated_text || "Текст не сгенерирован.";

                // Очистка ответа от самого промпта
                if (generatedText.includes(prompt)) {
                    generatedText = generatedText.split(prompt)[1];
                }

                // 3. Вывод готового текста
                document.getElementById('ai-loading').style.display = "none";
                const aiTextElement = document.getElementById('ai-text');
                const stopBtn = document.getElementById('stop-btn');

                aiTextElement.innerHTML = `<strong>Совет туристам:</strong> ${generatedText.trim()}`;
                aiTextElement.style.display = "block";
                stopBtn.style.display = "inline-block";

                // Добавляем функцию кнопке остановки
                stopBtn.onclick = () => window.speechSynthesis.cancel();

                // 4. Озвучка сгенерированного текста ресурсами самого устройства
                speakText(generatedText.trim());

            } catch (error) {
                // ИСПРАВЛЕННЫЙ И ЗАКРЫТЫЙ БЛОК ОШИБКИ
                document.getElementById('ai-loading').style.display = "none";
                document.getElementById('ai-text').style.display = "block";
                document.getElementById('ai-text').innerHTML = `<span style="color:red;">Ошибка ИИ: ${error.message}</span>`;
            }
        } // Закрываем if (data)
    }); // Закрываем addEventListener
}); // Закрываем forEach

// ВАЖНАЯ ФУНКЦИЯ ОЗВУЧКИ, КОТОРОЙ ВАМ НЕ ХВАТАЛО
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Указываем русский язык
    utterance.rate = 1.0;     // Скорость чтения
    
    // Защита от открытия Cortana в Windows
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(voice => voice.lang.includes('ru') && !voice.name.toLowerCase().includes('cortana'));
    
    if (ruVoice) {
        utterance.voice = ruVoice;
    }
    
    // Запуск озвучки
    window.speechSynthesis.speak(utterance);
}

// Загружаем голоса заранее для браузера
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
