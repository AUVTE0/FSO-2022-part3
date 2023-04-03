const mongoose = require('mongoose')

// check for password in cl arg
if(process.argv.length < 3){
    console.log('missing password as argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fso:${password}@fso.xgrbbds.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose
    .connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((e) => {
        console.log('error connecting to MongoDB: ', e.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        // process.exit(0)
    })
}
else {
    const newPerson = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    newPerson.save().then( () => {
        console.log(`added ${newPerson.name} number ${newPerson.number} to phonebook`)
        mongoose.connection.close()
    })
}



