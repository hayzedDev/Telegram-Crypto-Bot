const fs = require('fs');
const axios = require('axios');
let currentUser, currentAddress;
let tempDB;
const readDB = function () {
  tempDB = fs.readFileSync('./tempDB.json', 'utf-8');
  tempDB = tempDB ? JSON.parse(tempDB) : tempDB;
};
const writeToDB = function (data, address) {
  fs.writeFileSync(
    './tempDB.json',
    JSON.stringify([
      {
        user: currentUser,
        addresses: [currentAddress],
        data: [
          {
            address: data.address,
            unconfirmed_n_tx: data.unconfirmed_n_tx,
            txrefs: data.txrefs ? [...data.txrefs] : [],
          },
        ],
      },
    ])
  );

  // if (!tempDB) {
  //   fs.writeFileSync(
  //     './tempDB.json',
  //     JSON.stringify([
  //       {
  //         user: currentUser,
  //         addresses: [currentAddress],
  //         data: [
  //           {
  //             address: data.address,
  //             unconfirmed_n_tx: data.unconfirmed_n_tx,
  //             txrefs: [...data.txrefs],
  //           },
  //         ],
  //       },
  //     ])
  //   );
  //   return;
  // }

  // let checkUser = tempDB
  //   ? tempDB.find((userInfo) => userInfo.user === currentUser)
  //   : undefined;

  // if (checkUser) {
  //   if (checkUser.addresses.includes(currentAddress)) return;
  //   const userIndex = tempDB.findIndex(
  //     (userInfo) => userInfo.user === currentUser
  //   );
  //   console.log(userIndex, 'userINdex');

  //   tempDB[userIndex] = {
  //     user: checkUser.user,
  //     addresses: [currentAddress, ...checkUser.addresses],
  //     data: [
  //       {
  //         address: data.address,
  //         unconfirmed_n_tx: data.unconfirmed_n_tx,
  //         txrefs: [...data.txrefs],
  //       },
  //       ...checkUser.data,
  //     ],
  //   };

  //   fs.writeFileSync('./tempDB.json', JSON.stringify(tempDB));
  //   return;
  // }

  // const latestData = {
  //   user: currentUser,
  //   addresses: [currentAddress],
  //   data: [
  //     {
  //       address: data.address,
  //       unconfirmed_n_tx: data.unconfirmed_n_tx,
  //       txrefs: [...data.txrefs.find((txref) => txref)],
  //     },
  //   ],
  // };
  // tempDB.push(latestData);
  // fs.writeFileSync('./tempDB.json', JSON.stringify(tempDB));
};

exports.getTrx = async function (address) {
  try {
    const result = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/addrs/${address}`
    );
    // console.log(JSON.parse(result.data));
    writeToDB(result.data, address);
    readDB();

    // console.log(result.data.txrefs.length);
  } catch (err) {
    console.log(err);
  }
};

exports.currentUserAndAddress = function (user, address) {
  currentUser = user;
  currentAddress = address;
  return tempDB.at(0).data.at(0).unconfirmed_n_tx;
};

exports.confirmedTrx = function () {
  let DBdata = tempDB.at(0).data.at(0);
  if (DBdata.txrefs?.length > 0) {
    DBdata = DBdata.txrefs.filter((trx) => {
      let date = new Date(trx.confirmed).getTime();

      const date1 = Date.now() - 86400000;
      // console.log(date, date1);
      return date >= date1;
    }).length;
  }
  return typeof DBdata === 'number' ? DBdata : 0;
};
