const { crypto, hours } = require('./../helpers');

class BotView {
  data;
  constructor() {
    this.crypto = crypto.toLowerCase();
  }
  checkBtcStatus() {}

  replyTrxStatusText(replyName, unconfirmedTRX, confirmedTrx) {
    return `Hi ${replyName}, you have ${unconfirmedTRX} unconfirmed (pending) coin!\n\nYou also have ${confirmedTrx} confirmed transaction(s) in the last 24 hours. `;
    // return `This wallet address has ${unconfirmed} unconfimed transaction${
    //   unconfirmed <= 1 ? "" : "s"
    // } and ${confirmed} confirmed transaction${
    //   confirmed <= 1 ? "" : "s"
    // } in the past ${hours} hours.`;
  }

  replyTrxStatusInline() {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `Check unconfirmed transaction`,
              url: 'www.unaab.edu.ng',
            },
          ],
          [],
          [],
        ],
      },
    };
  }
  replyMessage() {
    return `Please send your ${this.crypto} wallet address`;
  }

  replyInvalidAddress() {
    return `Uh! Oh.... This is an invalid ${this.crypto} address`;
  }
  startHandler(ctx) {
    const firstName = ctx.update.message.from.first_name;
    const lastName = ctx.update.message.from.last_name;

    ctx.reply(`Hi, ${firstName ? firstName : ''} ${lastName ? lastName : ''}`);
  }

  stickerHandler(ctx) {
    const sticker = ctx.update.message.sticker.emoji;
    // const sticker = ctx.update.message.sticker.file_id;
    let a = true;
    console.log(ctx.update.message);
    while (a) {
      ctx.reply(`Hi, I'm greeting you too!!`);
      a = undefined;
    }

    setTimeout(() => {
      ctx.reply(sticker);
    }, 1);
  }
  setData() {}
}

module.exports = new BotView();
