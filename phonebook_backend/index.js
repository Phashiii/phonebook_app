const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(morgan((tokens, request, response) => {
return[
  request.method,
  request.url,
  tokens.status(request, response),
  
  tokens['response-time'](request, response), 'ms',
  JSON.stringify(request.body)
].join(" ")
}))


let contacts = [
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
    },
    { 
      "id": 7,
      "name": "Gary Poppendieck", 
      "number": "9-23-6423122"
    }
]
app.get('/api/persons', (request, response) => {
    response.json(contacts)
  })

app.get('/info', (request, response) => {
    const date = Date()
    response.send(`<p>Phonebook has info for ${contacts.length} people</p><br><p>${date}</p></br>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)

    if(contact)
    {
        response.json(contact)
    }else{
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const matchingName = contacts.map(contact => contact.name).includes(body.name)
    if(!body.name || !body.number)
    {
      return response.status(400).json({ 
          error: 'content missing' 
      })
    }else if(matchingName)
    {
      return response.status(400).json({ 
          error: 'name must be unique' 
      })
    }
    const contact = {
        "id": Math.floor(Math.random() *1000),
    "name": body.name,
    "number": body.number
    }

    const entries = contacts.concat(contact)
    contacts = entries
   

    response.json(contact)
    
    console.log(contacts)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})