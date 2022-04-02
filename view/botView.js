const { crypto, hours } = require('./../helpers');

class BotView {
  data;
  constructor() {
    this.crypto = crypto.toLowerCase();
  }
  checkBtcStatus() {}

  replyTrxStatusText(ctx, unconfirmedTRX, confirmedTrx) {
    return `Hi ${ctx}, you have ${unconfirmedTRX} unconfirmed coin!\n\nYou also have ${confirmedTrx} confirmed transaction(s) in the last 24 hours. `;
    // return `This wallet address has ${unconfirmed} unconfimed transaction${
    //   unconfirmed <= 1 ? "" : "s"
    // } and ${confirmed} confirmed transaction${
    //   confirmed <= 1 ? "" : "s"
    // } in the past ${hours} hours.`;
  }

  replyTrxStatusInline() {
    return [
      [
        {
          text: `Check unconfirmed transaction`,
        },
      ],
      [],
      [],
    ];
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
    console.log(
      ctx.update.message.from.last_name,
      ctx.update.message.from.first_name
    );
    ctx.reply(`Hi, ${firstName ? firstName : ''} ${lastName ? lastName : ''}`);
    //   ctx.reply(`${firstName} ${lastName}`);
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
