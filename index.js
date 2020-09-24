const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('postData', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123465"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

const generateID = () => {
  return Math.ceil(Math.random() * 10000000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return ( res.status(400).json({
      error: 'Either name or number is missing'
    }))
  }

  if (persons.find(p => p.name === body.name)) {
    return (res.status(400).json({
      error: 'Name already in phonebook. Name must be unique'
    }))
  }

  const newPerson = {
    id: generateID(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)

  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`)
})
