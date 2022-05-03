const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const { Telegraf } = require('telegraf');
const WAValidator = require('wallet-address-validator');

const botView = require('./view/botView');
const { crypto } = require('./helpers');
const {
  getTrx,
  currentUser,
  currentAddress,
  currentUserAndAddress,
  confirmedTrx,
} = require('./model/model');
let bot = new Telegraf(process.env.BOT_TOKEN);

if (process.env.NODE_ENV === 'production') {
  const API_TOKEN = process.env.API_TOKEN || '';
  const PORT = process.env.PORT || 3000;
  const URL = process.env.URL || 'https://your-heroku-app.herokuapp.com';

  // bot = new Telegraf(API_TOKEN);

  bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
  bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
}
let address;
bot.start(botView.startHandler);
// bot.command("help", botView.helpHandler);
bot.on('sticker', botView.stickerHandler);
bot.command('checkbtcstatus', (ctx) => {
  ctx.reply(botView.replyMessage());
  bot.on('text', async (textCtx) => {
    address = textCtx.update.message.text;

    const firstName = textCtx.update.message.from.first_name;
    const lastName = textCtx.update.message.from.last_name;
    let replyName = '';

    if (firstName || lastName) {
      replyName = `${firstName ? firstName : ''}${
        lastName ? ` ${lastName}` : ''
      }`;
    }

    const valid = WAValidator.validate(`${address}`, `${crypto}`);
    if (!valid)
      return textCtx.reply(
        `${botView.replyInvalidAddress()}\n\n${botView.replyMessage()} `
      );
    await getTrx(address);

    const confirmedTrxs = confirmedTrx();
    const unconfirmedTRX = currentUserAndAddress(
      textCtx.update.message.from.username,
      address
    );

    // currentUser = textCtx.update;
    textCtx.reply(
      botView.replyTrxStatusText(replyName, unconfirmedTRX, confirmedTrxs),
      botView.replyTrxStatusInline()
    );

    // console.log(ctx.update.message.text);
  });
});

bot.launch();

console.log('Bot connected Successfully');
