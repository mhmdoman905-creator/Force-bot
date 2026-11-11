const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME;
const bot = new TelegramBot(TOKEN, { polling: true });
console.log('Force Sub jalan...');
async function isJoined(userId) {
  try {
    const m = await bot.getChatMember(CHANNEL_ID, userId);
    return ['member','administrator','creator'].includes(m.status);
  } catch(e){ return false; }
}
function joinKeyboard(){
  return { reply_markup: { inline_keyboard: [
    [{ text: '📢 Join Channel Dulu', url: `https://t.me/${CHANNEL_USERNAME.replace('@','')}` }],
    [{ text: '✅ Saya Sudah Join, Cek Lagi', callback_data: 'check_join' }]
  ]}};
}
bot.onText(/\/start/, async (msg) => {
  const joined = await isJoined(msg.from.id);
  if(!joined) return bot.sendMessage(msg.chat.id, `⚠️ *Wajib Join Dulu!*\n\nJoin dulu ${CHANNEL_USERNAME} baru bisa pake bot.`, { parse_mode: 'Markdown', ...joinKeyboard() });
  bot.sendMessage(msg.chat.id, `✅ *Selamat Datang!*\n\nUdah join, bot kebuka. Ketik /menu`, { parse_mode: 'Markdown' });
});
bot.on('callback_query', async (q) => {
  if(q.data === 'check_join'){
    const joined = await isJoined(q.from.id);
    if(joined){ await bot.answerCallbackQuery(q.id,{text:'Mantap! Udah join ✅'}); bot.sendMessage(q.message.chat.id, `✅ Udah ke-verifikasi! Ketik /menu`); }
    else await bot.answerCallbackQuery(q.id,{text:'Belum join! Join dulu bro', show_alert:true});
  }
});
bot.onText(/\/menu/, async (msg) => {
  const joined = await isJoined(msg.from.id);
  if(!joined) return bot.sendMessage(msg.chat.id, `Join dulu ${CHANNEL_USERNAME}`, joinKeyboard());
  bot.sendMessage(msg.chat.id, `🛒 *KATALOG*\n\n1. Akun Premium - 15k\n2. Followers - 10k`, { parse_mode: 'Markdown' });
});
