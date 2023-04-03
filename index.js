require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('data', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))


app.get('/', (req, res) => {
    res.send('<h1>Hello!</h1>')
})

app.get('/info', (req, res) => {
    const receiveTime = new Date()
    console.log(receiveTime.toISOString())
    Person.find()
        .then( persons => res.send(
            `<p>Phonebook has info for ${persons.length} people</p>
                ${receiveTime}`))
        .catch( error => next(error))
    

})


app.get('/api/persons', (req, res, next) =>{
    Person.find()
        .then( persons => res.json(persons))
        .catch( error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
    console.log(next)
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if(person){
                res.send(person)
            }
            // else{
            //     console.log('Person not found!')
            //     res.status(404).end()
            // }
        })
        .catch(error => {
            next(error)
        })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const person = Person.findById(id)
    Person.findByIdAndRemove(id)
        .then(result => {
            console.log('Success deleting')
            res.status(204).end()
        })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (req, res, next) => {
    if(!req.body.name || !req.body.number){
        res.statusMessage = "Name or number missing"
        res.status(400).end()
    }
    // if(persons.map(p => p.name).includes(req.body.name)){
    //     res.statusMessage = "Person already exists"
    //     res.status(400).end()
    // }

    const newPerson = new Person({
        // id: generateId(),
        name: req.body.name,
        number: req.body.number
    })
    newPerson.save()
    .then( result => {
        console.log(result)
        // persons = persons.concat(newPerson)
        res.json(newPerson)
    })
    .catch(error => {
        next(error)
    })
    
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    console.log("Request body", req.body)
    const person = {
        name: body.name,
        number: body.number
    }
    console.log(person)
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then( updatedPerson => res.json(updatedPerson))
    .catch(error =>{
        next(error)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)
const errorHandler = (error, req, res, next) => {
    console.log('error!')
    // console.error(error.message)

    if(error.name === "CastError"){
        return res.status(400).send({error: 'malformatted id'})
    }
    else{
        return res.status(400).send({error: 'unknown error'})
    }
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})