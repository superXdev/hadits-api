const cheerio = require('cheerio');
const Sequelize = require('sequelize');
const request = require('request-promise')
const input = require('input');
require('dotenv').config();

const sequelize = new Sequelize({
   dialect: 'sqlite',
   storage: 'data.db',
   logging: false
});

const Hadis = sequelize.define('Hadis', {
   nomor: Sequelize.INTEGER,
   perawi: Sequelize.STRING,
   arabic: Sequelize.TEXT,
   terjemahan: Sequelize.TEXT,
   riwayat: Sequelize.STRING
}, {
  timestamps: false
});

/* 
   - bukhari: 7008 *
   - muslim: 5362 *
   - abudaud: 4590 *
   - tirmidzi: 3891 *
   - nasai: 5662 *
   - ibnumajah: 4332 *
   - malik: 1594 *
   - ahmad: 15070 *
   - darimi: 3367 *
*/

(async function() {
   // sync database
   await sequelize.sync();

   // await Hadis.destroy({ truncate: true });

   const p = await input.text('Hadits:');
   let page = parseInt(await input.text('From page:'));

   console.log('Scrapping hadis:', p);

   // scrapping over page
   while(true) {
      try {
         const url = `https://hadits.in/${p}/${page}`;

         const data = await request({
            url: url,
            proxy: process.env.ROTATING_PROXY
         });
      
         if(data) {
            console.log('[', p, '] Halaman:', page);
            const $ = cheerio.load(data);

            // stop scrapping
            if($('title').text() === 'Ensiklopedi Hadits - Kitab 9 Imam') {
               console.log('Total:', page - 1);
               break;
            }

            // get info
            const arabic = $('#arabic_container').text();
            const arti = $('#terjemah_container').text();
            const hr = $('[property="og:title"]').attr('content');

            Hadis.create({
               nomor: page,
               perawi: p,
               arabic: arabic,
               terjemahan: arti,
               riwayat: hr
            });

            page++;
         }
      } catch(err) {
         console.log(err.message);
      }
   }
   
})();

