const express = require('express');
const { Sequelize, Model, DataTypes } = require('sequelize');
const Op = Sequelize.Op;

// Initialize express app
const app = express();

// Connect to SQLite database
const sequelize = new Sequelize({
   dialect: 'sqlite',
   storage: 'data.db',
   logging: false
});

// Define model for Hadis table
class Hadis extends Model {}
Hadis.init({
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },
   nomor: DataTypes.INTEGER,
   perawi: DataTypes.STRING,
   arabic: DataTypes.TEXT,
   terjemahan: DataTypes.TEXT,
   riwayat: DataTypes.STRING
}, {
   sequelize,
   modelName: 'hadis',
   timestamps: false
});

// Define pagination function
const paginate = async (query, { page, limit }) => {
   const offset = page * limit;
   const count = await Hadis.count();
   const pageCount = Math.ceil(count / limit);
   return {
      items: query.offset(offset).limit(limit),
      meta: {
         count,
         pageCount,
         page,
         pageSize: limit
      }
   };
};

// Define routes
app.get('/', async (req, res) => {
   try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const result = await Hadis.findAndCountAll({
         where: { id: { [Op.gt]: offset } },
         limit
      });

      const pageCount = Math.ceil(result.count / limit);
      const response = {
         items: result.rows,
         meta: {
            total: result.count,
            totalPage: pageCount,
            page,
            pageSize: limit
         }
      };

      res.json(response);
   } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Something went wrong' });
   }
});

app.get('/:perawi/:nomor', async (req, res, next) => {
   try {
      const perawi = req.params.perawi;
      const nomor = parseInt(req.params.nomor);

      const result = await Hadis.findOne({
         where: { perawi, nomor }
      });

      if (!result) {
         return res.status(404).json({ message: 'Hadits not found' });
      }

      res.json(result);
   } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Something went wrong' });
   }
});

app.get('/id/:id', async (req, res) => {
   const id = req.params.id;
   const hadis = await Hadis.findByPk(id);
   if (hadis) {
      res.json(hadis);
   } else {
      res.status(404).json({ error: 'Hadits not found' });
   }
});

app.get('/search', async (req, res, next) => {
   try {
      const q = req.query.q || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      // Generate the where condition
      const where = {};
      if (q) {
         where.terjemahan = { [Op.like]: `%${q}%` };
      }

      const result = await Hadis.findAndCountAll({
         where,
         offset: (page - 1) * limit,
         limit
      });

      const pageCount = Math.ceil(result.count / limit);
      const response = {
         items: result.rows,
         meta: {
         total: result.count,
         totalPage: pageCount,
            page,
            pageSize: limit,
            query: q
         }
      };

      res.json(response);
   } catch (error) {
      console.log(error.message)
      res.status(500).json({ error: 'Something went wrong' });
   }
});


// Start the server
sequelize.sync().then(() => {
   app.listen(3000, () => {
      console.log('Server started on http://localhost:3000');
   });
});
