# hadits-api

![Cover](https://github.com/superXdev/hadits-api/blob/main/cover.png?raw=true)

Web Rest API kumpulan hadis dari 9 perawi degan total 50k+ lebih hadis antara lain:
1. bukhari: 7008
2. muslim: 5362
3. abudaud: 4590
4. tirmidzi: 3891
5. nasai: 5662
6. ibnumajah: 4332
7. malik: 1594
8. ahmad: 15070
9. darimi: 3367


__Sumber :__ https://hadits.in


# Dokumentasi API

Mengambil semua daftar hadis (10 data / page)

```
GET /
```

Mencari banyak hadis berdasarkan terjemahan

```
GET /search?q=keyword
```

Mengambil satu hadis berdasarkan perawi dan nomor nya

```
GET /{perawi}/{nomor}
```

Mengambil satu hadis berdasarkan ID

```
GET /id/{id}
```


# Stack

- Nodejs
- Expressjs
- Sequelize
- Cheerio (scrap)

# Instalation

```sh
git clone https://github.com/superXdev/hadits-api
```

```sh
npm install
```

```sh
cp .env.example .env
```
__Wajib menggunakan rotating proxy untuk scrapper__

Development server
```sh
npm run dev
```

Prod server
```sh
npm start
```

## Scrapping

```sh
node scrapper.js
```

## License

This software licensed under the [MIT license](https://opensource.org/licenses/MIT).
