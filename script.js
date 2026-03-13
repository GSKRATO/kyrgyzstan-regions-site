// База данных ваших регионов с полным текстом
const regionsData = {
    "issyk-kul": {
        name: "Иссык-Кульская область",
        description: "Иссык-Кульская область — это туристическая жемчужина Кыргызстана, известная на весь мир своим незамерзающим высокогорным озером Иссык-Куль. Озеро окружено заснеженными хребтами Тянь-Шаня, создавая уникальный микроклимат, сочетающий горную свежесть и морской бриз. Регион славится песчаными пляжами, горячими минеральными источниками и живописными ущельями.",
        image: "issyk-kul.jpg"
    },
    "chuy": {
        name: "Чуйская область",
        description: "Чуйская область — это самый экономически развитый и густонаселенный регион страны, расположенный в плодородной долине у подножия Кыргызского хребта. Именно здесь находится столица государства — динамичный город Бишкек. Область богата историческими памятниками, включая знаменитую башню Бурана на месте древнего города Баласагун.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop"
    },
    "osh": {
        name: "Ошская область",
        description: "Ошская область — колоритный южный регион с древнейшей историей и уникальной культурой. Его центр, город Ош, которому более 3000 лет, называют «Южной столицей». Главная достопримечательность — священная гора Сулайман-Тоо, возвышающаяся прямо в центре города. Регион славится своим гостеприимством и шумными восточными базарами.",
        image: "osh.jpg"
    },
    "naryn": {
        name: "Нарынская область",
        description: "Нарынская область — это самый высокогорный, суровый и малонаселенный регион, который часто называют «сердцем Тянь-Шаня». Это край нетронутой дикой природы, величественных скал и бескрайних пастбищ (джайлоо), где до сих пор сильны традиции кочевников. Здесь находятся озеро Сон-Куль и караван-сарай Таш-Рабат.",
        image: "naryn.jpg"
    },
    "jalal-abad": {
        name: "Джалал-Абадская область",
        description: "Джалал-Абадская область отличается мягким климатом и невероятно разнообразной природой: от засушливых предгорий до пышных оазисов. Этот регион знаменит на весь мир своими уникальными реликтовыми орехово-плодовыми лесами Арсланбоб, которые являются крупнейшими на планете.",
        image: "jalal-abad.jpg"
    },
    "talas": {
        name: "Таласская область",
        description: "Таласская область — это небольшой, изолированный горами регион на северо-западе страны, который играет огромную роль в духовной культуре народа. Эта земля считается родиной легендарного богатыря Манаса, героя главного кыргызского эпоса. Здесь расположен национальный комплекс «Манас Ордо».",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop"
    },
    "batken": {
        name: "Баткенская область",
        description: "Баткенская область — самый молодой и отдаленный регион на юго-западе Кыргызстана, известный своими контрастными пейзажами и скалистыми горами. Этот край славится на всю Центральную Азию своими невероятно сладкими абрикосами (урюком). Также здесь растет редчайший эндемичный цветок Айгуль.",
        image: "batken.jpg"
    }
};

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', async (e) => {
        const regionKey = e.currentTarget.getAttribute('data-region');
        const data = regionsData[regionKey];
        const infoContent = document.getElementById('info-content');

        if (data) {
            // Останавливаем старую озвучку при новом клике
            window.speechSynthesis.cancel();

            // Отрисовка интерфейса
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <img src="${data.image}" alt="Фотография: ${data.name}" style="margin: 15px 0; max-width: 100%; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p class="region-desc" style="font-size: 1.1em; line-height: 1.6;">${data.description}</p>
                    
                    <div style="margin-top: 25px; padding: 20px; background: #f0f7ff; border-radius: 12px; border-left: 5px solid #0056b3; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <p id="ai-loading" style="color: #0056b3; font-weight: bold; display: flex; align-items: center;">
                            <span style="margin-right: 10px; font-size: 1.5em;">✨</span> ИИ генерирует уникальный рассказ...
                        </p>
                        <p id="ai-text" class="tourist-desc" style="display: none; font-size: 1.1em; line-height: 1.6; color: #2c3e50;"></p>
                        <button id="stop-btn" style="display: none; margin-top: 15px; padding: 10px 20px; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background-color 0.2s;">Остановить озвучку</button>
                    </div>
                </div>
            `;
            
            // Плавная прокрутка
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth', block: 'start' });

            try {
                // Промпт для ИИ с запросом на 3-5 предложений
                const prompt = `Ты профессиональный гид по Кыргызстану. Расскажи интересный, захватывающий и малоизвестный факт или легенду для туристов про ${data.name}. Текст должен состоять ровно из 3-5 предложений. Пиши только на русском языке, без приветствий.`;
                
                // ОБНОВЛЕНИЕ: Генерируем случайное число, чтобы текст ИИ каждый раз был новым!
                const randomSeed = Math.floor(Math.random() * 1000000);
                
                // Обращение к открытому ИИ Pollinations с добавлением случайного числа
                const response = await fetch('https://text.pollinations.ai/' + encodeURIComponent(prompt) + '?model=openai&seed=' + randomSeed);

                if (!response.ok) {
                    throw new Error("Проблема с сетью при обращении к ИИ.");
                }

                // Получаем готовый текст
                const generatedText = await response.text();

                // Выводим текст на экран
                document.getElementById('ai-loading').style.display = "none";
                const aiTextElement = document.getElementById('ai-text');
                const stopBtn = document.getElementById('stop-btn');

                aiTextElement.innerHTML = `<strong>Подробности от ИИ-гида:</strong> <br><br> ${generatedText}`;
                aiTextElement.style.display = "block";
                stopBtn.style.display = "inline-block";

                // Функция для кнопки остановки
                stopBtn.onclick = () => window.speechSynthesis.cancel();

                // Запуск озвучки (встроенными голосами устройства)
                speakText(generatedText);

            } catch (error) {
                document.getElementById('ai-loading').style.display = "none";
                document.getElementById('ai-text').style.display = "block";
                document.getElementById('ai-text').innerHTML = `<span style="color:red;">Не удалось загрузить рассказ от ИИ. Проверьте подключение к интернету.</span>`;
                console.error("AI Error:", error);
            }
        }
    });
});

// Улучшенная функция: охота за "живыми" голосами
function speakText(text) {
    if (!window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; 
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    let voices = window.speechSynthesis.getVoices();
    let targetVoice = null;

    // Шаг 1: Ищем самые качественные нейронные голоса (обычно есть в браузере Edge)
    targetVoice = voices.find(v => v.lang.includes('ru') && (v.name.includes('Natural') || v.name.includes('Online')));

    // Шаг 2: Если их нет, ищем хорошие голоса от Google (на смартфонах Android и в Chrome)
    if (!targetVoice) {
        targetVoice = voices.find(v => v.lang.includes('ru') && v.name.includes('Google'));
    }

    // Шаг 3: Если и их нет, берем любой русский голос, кроме сломанной Cortana
    if (!targetVoice) {
        targetVoice = voices.find(v => v.lang.includes('ru') && !v.name.toLowerCase().includes('cortana'));
    }

    if (targetVoice) {
        utterance.voice = targetVoice;
    }
    
    window.speechSynthesis.speak(utterance);
}

// Подгружаем голоса асинхронно
window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

