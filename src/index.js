const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))

const porta = 8080
app.listen(porta, () => {
    console.log(`Frontend rodando na http://localhost:${porta}`)
})