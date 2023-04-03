const express = require('express')
var morgan = require('morgan')
const app = express()

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
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

const generateId = () => {
    let newId = Math.floor(Math.random()*1000)
    while(persons.find(p => p.id === newId)){
        newId = generateId()
    }
    return newId
}

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

app.post('/api/persons', (req, res) => {
    if(!req.body.name || !req.body.number){
        res.statusMessage = "Name or number missing"
        res.status(400).end()
    }
    if(persons.map(p => p.name).includes(req.body.name)){
        res.statusMessage = "Person already exists"
        res.status(400).end()
    }

    const newPerson = {
        id: generateId(),
        name: req.body.name,
        number: req.body.number
    }
    persons = persons.concat(newPerson)
    res.send(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})