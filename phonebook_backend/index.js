require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Entry = require('./models/entry')
const entry = require('./models/entry')
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

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id'})
  }else if(error.name === 'ValidationError'){
    const body = request.body
    return response.status(400).send({error: error.message})
    //return response.status(400).send({error: `Person validation failed: name: Path \`name\` (${body.name}) is shorter than the minimum allowed length (3).`})
  }

  next(error)
}

let contacts = []

app.get('/api/persons', (request, response) => {
   Entry.find({}).then(entries=> {
    response.json(entries)
    contacts = entries
    console.log(contacts.length)
    
   })
})

app.get('/info', (request, response) => {
    const date = Date()
    response.send(`<p>Phonebook has info for ${contacts.length} people</p><br><p>${date}</p></br>`)
})

app.get('/api/persons/:id', (request, response, next) => {
    Entry.findById(request.params.id)
    .then(entry => {
      response.json(entry)
    
    if(contact)
    {
        response.json(contact)
    }else{
        response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const matchingName = contacts.map(contact => contact.name).includes(body.name)
    
    if(body.name === undefined || body.number === undefined)
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
    const entry = new Entry({
      "name": body.name,
      "number": body.number
    })

    entry.save().then(savedEntry => {
      response.json(savedEntry)
    })
    .catch(error => next(error,request))
})

app.delete('/api/persons/:id' ,(request,response, next) => {
  Entry.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
  console.log("delete request")
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body
  
  Entry.findByIdAndUpdate(request.params.id,{name, number}, {new: true, runValidators: true, context: 'query'})
  .then(updatedEntry =>
    {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})