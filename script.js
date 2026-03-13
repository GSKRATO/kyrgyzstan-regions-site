const tokenPart1 = "hf_"; 
const tokenPart2 = "ВАШИ_БУКВЫ_ТОКЕНА_ЗДЕСЬ"; // Вставьте сюда вторую часть вашего токена

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
            window.speechSynthesis.cancel();

            // Отрисовка интерфейса
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <img src="${data.image}" alt="Фотография: ${data.name}" style="margin: 15px 0; max-width: 100%; border-radius: 8px;">
                    <p class="region-desc"><strong>О регионе:</strong> ${data.description}</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #eef2f5; border-radius: 8px; border-left: 4px solid #0056b3;">
                        <p id="ai-loading" style="color: #0056b3; font-style: italic;">✨ Нейросеть генерирует уникальный факт для туристов (может занять 10-15 секунд)...</p>
                        <p id="ai-text" class="tourist-desc" style="display: none;"></p>
                        <button id="stop-btn" style="display: none; margin-top: 15px; padding: 8px 16px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Остановить озвучку</button>
                    </div>
                </div>
            `;
            
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth' });

            try {
                // Изменили модель на Qwen 2.5 (работает быстрее и стабильнее)
                const prompt = `Напиши один короткий, интересный и уникальный факт для туристов про ${data.name} в Кыргызстане. Не повторяйся.`;
                
                const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-7B-Instruct", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${HUGGING_FACE_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: { 
                            max_new_tokens: 150, 
                            temperature: 0.9, // 0.9 обеспечит сильное разнообразие текста
                            return_full_text: false // чтобы нейросеть не повторяла ваш вопрос
                        } 
                    })
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сервера: ${response.status}. Возможно, бесплатная модель спит, попробуйте еще раз через минуту.`);
                }

                const apiData = await response.json();
                let generatedText = apiData[0].generated_text || "Текст не сгенерирован.";

                // Вывод готового текста
                document.getElementById('ai-loading').style.display = "none";
                const aiTextElement = document.getElementById('ai-text');
                const stopBtn = document.getElementById('stop-btn');

                aiTextElement.innerHTML = `<strong>Совет от ИИ:</strong> ${generatedText.trim()}`;
                aiTextElement.style.display = "block";
                stopBtn.style.display = "inline-block";

                stopBtn.onclick = () => window.speechSynthesis.cancel();

                speakText(generatedText.trim());

            } catch (error) {
                document.getElementById('ai-loading').style.display = "none";
                document.getElementById('ai-text').style.display = "block";
                document.getElementById('ai-text').innerHTML = `<span style="color:red;">Сбой связи с сервером (Failed to fetch). Если вы используете VPN или AdBlock, попробуйте отключить их. Либо сервер загружается, нажмите на регион еще раз!</span>`;
            }
        }
    });
});

function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; 
    utterance.rate = 1.0;     
    
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(voice => voice.lang.includes('ru') && !voice.name.toLowerCase().includes('cortana'));
    
    if (ruVoice) {
        utterance.voice = ruVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
