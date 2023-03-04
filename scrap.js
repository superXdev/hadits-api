const cheerio = require('cheerio');
const Sequelize = require('sequelize');
const request = require('request-promise')
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


(async function() {
   // sync database
   await sequelize.sync();

   // await Hadis.destroy({ truncate: true });

   // const list = ['bukhari', 'muslim', 'abudaud', 'tirmidzi', 'nasai', 'ibnumajah', 'malik', 'ahmad', 'darimi'];
   const list = ['bukhari', 'muslim'];

   for(p of list) {
      console.log('Scrapping hadis:', p);
      let page = 1857;
      let hadis = []

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
                  page = 1;
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
               })

               page++;
            }
         } catch(err) {
            console.log(err.message);
         }
         
      }

      // insert data
      await Hadis.bulkCreate(hadis)
      
   }
   
})();

