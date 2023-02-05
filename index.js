const config = require("./config.json");
const TelegramApi = require('node-telegram-bot-api');
const {Configuration, OpenAIApi} = require("openai");
const token = config['telegram_token'];
const api_key = config['open_ai_token'];


const bot = new TelegramApi(token, {polling: true})
const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/about', description: 'О боте'},
        {command: '/aboutme', description: 'Обо мне'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Hi! Ask me any question, and I will try to answer it')
        } else if (text === '/about') {
            return bot.sendMessage(chatId, 'This is a bot based on the Davinci GPT-3. Ask your question and the bot will try to answer it. Currently has a limit of 900 characters')
        } else if (text === '/aboutme') {
            return bot.sendMessage(chatId, 'If you have any questions about the bot, write me @volkov_den')
        } else {
            const { Configuration, OpenAIApi } = require("openai");
            const configuration = new Configuration({
                apiKey: api_key,
            });
            const openai = new OpenAIApi(configuration);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${text}`,
                temperature: 0.5,
                max_tokens: 900,
                top_p: 1.0,
                frequency_penalty: 0.5,
                presence_penalty: 0.0,
            });

            return bot.sendMessage(chatId, response.data['choices'][0]['text'])
        }
    })
}

start();
