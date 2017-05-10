import React from 'react'
import express from 'express'

const app = express()

app.use('/static/', express.static(__dirname + '/../../public'))

app.get('/*', (req,res) => {
  res.send('Hello, AHHDHSHASHSH')
})

console.log('App is ok!')

const port = process.env.APP_PORT || 3002
const server = app.listen(port, function () {
  console.log('Example app listening at http://::%s', port)
})
