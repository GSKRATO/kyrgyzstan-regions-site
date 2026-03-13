// Импортируем библиотеку Transformers.js напрямую через CDN
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Настраиваем загрузку моделей напрямую с Hugging Face Hub (без серверов-посредников)
env.allowLocalModels = false;

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

// Глобальная переменная для хранения скачанной нейросети в памяти браузера
let aiPipeline = null;

document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('click', async (e) => {
        const regionKey = e.currentTarget.getAttribute('data-region');
        const data = regionsData[regionKey];
        const infoContent = document.getElementById('info-content');

        if (data) {
            window.speechSynthesis.cancel();

            // Отрисовка базового интерфейса с индикатором загрузки
            infoContent.innerHTML = `
                <div class="region-card">
                    <h3>${data.name}</h3>
                    <img src="${data.image}" alt="Фотография: ${data.name}" style="margin: 15px 0; max-width: 100%; border-radius: 8px;">
                    <p class="region-desc"><strong>О регионе:</strong> ${data.description}</p>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #eef2f5; border-radius: 8px; border-left: 4px solid #0056b3;">
                        <p id="ai-loading" style="color: #0056b3; font-weight: bold;">Подготовка искусственного интеллекта...</p>
                        <p id="ai-text" class="tourist-desc" style="display: none; line-height: 1.6;"></p>
                        <button id="stop-btn" style="display: none; margin-top: 15px; padding: 8px 16px; background-color: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">Остановить озвучку</button>
                    </div>
                </div>
            `;
            
            document.getElementById('region-info').scrollIntoView({ behavior: 'smooth' });

            const loadingText = document.getElementById('ai-loading');
            const aiTextElement = document.getElementById('ai-text');
            const stopBtn = document.getElementById('stop-btn');

            try {
                // Если модель еще не скачана, загружаем её с отображением прогресса
                if (!aiPipeline) {
                    loadingText.innerText = "Первый запуск: Скачивание нейросети в браузер. Пожалуйста, подождите (около 350 МБ)...";
                    
                    aiPipeline = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
                        progress_callback: (progressData) => {
                            if (progressData.status === 'downloading') {
                                // Показываем проценты скачивания файлов
                                const percent = Math.round((progressData.loaded / progressData.total) * 100) || 0;
                                loadingText.innerText = `Скачивание файлов ИИ: ${percent}% (подождите, это нужно сделать только один раз)`;
                            } else if (progressData.status === 'ready') {
                                loadingText.innerText = "Распаковка модели...";
                            }
                        }
                    });
                }

                loadingText.innerText = "✨ Нейросеть генерирует уникальный факт прямо на вашем устройстве...";

                // Форматируем промпт специально для модели Qwen
                const prompt = `<|im_start|>system\nТы туристический гид. Отвечай очень коротко, одним интересным предложением.<|im_end|>\n<|im_start|>user\nНапиши один короткий интересный факт про ${data.name} в Кыргызстане.<|im_end|>\n<|im_start|>assistant\n`;

                // Запускаем генерацию прямо в браузере!
                const result = await aiPipeline(prompt, {
                    max_new_tokens: 60,
                    temperature: 0.8, // Делает текст разным каждый раз
                    repetition_penalty: 1.1,
                    do_sample: true
                });

                // Очищаем результат от промпта
                let generatedText = result[0].generated_text.replace(prompt, '').trim();

                // Вывод готового текста
                loadingText.style.display = "none";
                aiTextElement.innerHTML = `<strong>Совет от локального ИИ:</strong> ${generatedText}`;
                aiTextElement.style.display = "block";
                stopBtn.style.display = "inline-block";

                stopBtn.onclick = () => window.speechSynthesis.cancel();

                // Озвучка текста
                speakText(generatedText);

            } catch (error) {
                loadingText.style.display = "none";
                aiTextElement.style.display = "block";
                aiTextElement.innerHTML = `<span style="color:red;">Ошибка локального ИИ: ${error.message}</span>`;
                console.error(error);
            }
        }
    });
});

// Функция озвучки
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
