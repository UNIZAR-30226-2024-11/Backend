const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('hello from simple server :)')
})

app.listen(PORT, () => {
  console.log(`Example app listening at https://localhost:${PORT}`)
})
