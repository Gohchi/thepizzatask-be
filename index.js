const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json());

const cors = require('cors');
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? 'https://safe-cliffs-24219.herokuapp.com' : 'http://localhost:3000',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

app.get('/api', (req, res) => {
  res.status(200).json({api: 'version 1'})
})

//#region local info - offline
const products = [
  { id: 1, name: 'Total', price: 0, description: '', photo: '' },
  { id: 2, name: 'Shipping fee', price: 3, description: '', photo: '' },
  { id: 3, name: 'Salami', price: 5, description: 'With tomatoes and olives.', photo: 'p1' },
  { id: 4, name: 'Margherita', price: 5, description: 'Neapolitan pizza, made with tomatoes, fresh basil and olive oil.', photo: 'p2' },
  { id: 5, name: 'Pepperoni', price: 5, description: 'A great crust, gooey cheese, and tons of pepperoni.', photo: 'p3' },
  { id: 6, name: 'Sausages', price: 5, description: 'Sausages', photo: 'p4' },
  { id: 7, name: 'Mushrooms', price: 5, description: 'Mushrooms', photo: 'p5' },
  { id: 8, name: 'Chicken', price: 5, description: 'Chicken mushroom bell peppers cheese', photo: 'p6' },
  { id: 9, name: 'Green', price: 5, description: 'Sausages greens and parmesan', photo: 'p7' },
  { id: 10, name: 'Shrimp', price: 5, description: 'With shrimp, salmon and olives', photo: 'p8' },
];
const localOrders = [{
  id: 1,
  date: new Date(2020, 2, 12, 19, 22),
  items: [
    { id: 3, amount: 2, price: 5 },
    { id: 2, amount: 1, price: 3 },
    { id: 1, amount: 1, price: 8 }
  ],
  currencyBase: 1.12,
  currencyCode: 'USD'
},
{
  id: 2,
  date: new Date(2020, 3, 2, 11, 12),
  items: [
    { id: 3, amount: 2, price: 5 },
    { id: 4, amount: 1, price: 6 },
    { id: 2, amount: 1, price: 3 },
    { id: 1, amount: 1, price: 14 }
  ],
  currencyBase: 1.12,
  currencyCode: 'USD'
}];
//#endregion

app.get('/api/products', (req, res) => {
  if(process.env.NODE_ENV === "production"){

    call('SELECT * FROM pizzas', result => {
      res.status(200).json({
        pizzas: result
      });
    });
  } else {
    res.status(200).json({
      pizzas: products
    });
  }
})

app.get('/api/orders', (req, res) => {
  if(process.env.NODE_ENV === "production"){
    call('SELECT * FROM orders', orders => {
      call('SELECT * FROM orderitems', items => {
        res.status(200).json(orders.map(o => Object.assign({}, o, {
            items: items.filter(i => i.orderId == o.id).map(i => { return { id: i.pizzaId, amount: i.amount, price: i.price }; })
          }))
        );
      })
    });
  } else {
    res.status(200).json(localOrders);
  }
})

app.post('/api/order', (req, res) => {
  const data = req.body;
  // let order = {
  //   date: new Date(),
  //   items: action.items.map(i => {
  //     return {
  //       id: i.id,
  //       amount: i.amount,
  //       price: i.price * i.amount
  //     };
  //   }),
  //   currencyBase: action.currency.base,
  //   currencyCode: action.currency.code
  // };

  let sql = `INSERT INTO orders (date, currencyBase, currencyCode) VALUES (now(), ${data.currency.base}, "${data.currency.code}");`;
  call(sql, order => {
    const itemsjoined = data.items.map(i => `(${order.Id}, ${i.id}, ${i.amount}, ${i.price * i.amount})`).join(', ');
    sql = `INSERT INTO orderitems (orderId, pizzaId, amount, price) VALUES ${itemsjoined};`;
    call(sql, result => {
      res.status(200).json({
        order,
        items: result
      });
    });
  })
})

// app.get('/api/testdb', (req, res) => {
//   // let sql = "CREATE TABLE pizzas (id INT, name VARCHAR(255), price DOUBLE, description VARCHAR(255), photo VARCHAR(8) )";

//   let pizzasjoined = products.map(o => `(${o.id}, "${o.name}", ${o.price}, "${o.description}", "${o.photo}")`).join(', ');
//   let sql = `INSERT INTO pizzas (id, name, price, description, photo) VALUES ${pizzasjoined};`;
//   call(sql, result => {
//     res.status(200).json({
//       res: 'done'
//     });
//   });
  
// })

app.listen(port, () => console.log('server started on port', port))

function call(query, callback){
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  })

  connection.connect()
  
  connection.query(query, function (err, result) {
    if (err) throw err;
    callback(result);
  });
  
  connection.end()
}