const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/api', (req, res) => {
  res.status(200).json({api: 'version 1'})
})

app.listen(port, () => console.log('server started on port', port))