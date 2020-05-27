const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const cors = require('cors');
const corsOptions = {
  origin: 'https://safe-cliffs-24219.herokuapp.com',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

app.get('/api', (req, res) => {
  res.status(200).json({api: 'version 1'})
})
app.get('/api/products', (req, res) => {
  res.status(200).json({pizzas:  [
    { id: 1, name: 'Salami', price: 5, description: 'With tomatoes and olives.', photo: 'p1' },
    { id: 2, name: 'Margherita', price: 5, description: 'Neapolitan pizza, made with tomatoes, fresh basil and olive oil.', photo: 'p2' },
    { id: 3, name: 'Pepperoni', price: 5, description: 'A great crust, gooey cheese, and tons of pepperoni.', photo: 'p3' },
    { id: 4, name: 'Sausages', price: 5, description: 'Sausages', photo: 'p4' },
    { id: 5, name: 'Mushrooms', price: 5, description: 'Mushrooms', photo: 'p5' },
    { id: 6, name: 'Chicken', price: 5, description: 'Chicken mushroom bell peppers cheese', photo: 'p6' },
    { id: 7, name: 'Green', price: 5, description: 'Sausages greens and parmesan', photo: 'p7' },
    { id: 8, name: 'Shrimp', price: 5, description: 'With shrimp, salmon and olives', photo: 'p8' },
  ]})
})

app.listen(port, () => console.log('server started on port', port))