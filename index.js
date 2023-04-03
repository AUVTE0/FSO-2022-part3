const express = require('express')
const app = express()

app.use(express.json())

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/info', (req, res) => {
    const receiveTime = new Date()
    console.log(receiveTime.toISOString())
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
            ${receiveTime}`)

})


app.get('/api/persons', (req, res) =>{
    res.send(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        console.log('Person not found!')
        res.status(404).end()
    }
    res.send(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(!person){
        console.log('Person not found!')
        res.status(404).end()
    }
    persons = persons.filter(p => p.id !== id)
    console.log('Success deleting')
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})