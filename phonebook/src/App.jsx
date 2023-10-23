import { useEffect, useState } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newSearch, setSearch] = useState('')
  const [changeMessage, setChangeMessage] = useState(null)
  const [color,setColor] = useState('green')

///////////////////////////////////////////////////
//This fetches data from our server 
  const hook = () =>{
    phonebookService
    .getAll()
    .then(personInfo => {
      setPersons(personInfo)
    })
  }
  useEffect(hook,[])
///////////////////////////////////////////////////
  const addPerson = (event) =>{
    event.preventDefault()
    const personObj={
      name: newName,
      number: newNumber,
      
    }
    const checkName = personsObj => personsObj.name === newName
    const inThere = persons.some(checkName)
    
    if(newName !== '' && newNumber !== ''){ 
      if(!inThere){
      phonebookService
        .create(personObj)
        .then(personInfo =>{
        setPersons(persons.concat(personInfo))
        console.log(persons)
        setName('')
        setNumber('')
        setColor('green')
        setChangeMessage(`${newName} has been added to phonebook`)
        
        setTimeout(() =>{
        setChangeMessage(null)},5000)
      })
      }else{
          //When name alrady exists in phonebook
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new number?`)){
          const person = persons.find(p => p.name === newName)
          const oldNum = person.number
          const url= `http://localhost:3001/persons/${person.id}`
          const changedPerson = { ...person, number: newNumber }

          axios
          .put(url, changedPerson).then(response => {
            setPersons(persons.map(p => p.name !== newName ? p : response.data))
            setColor('yellow')
            setChangeMessage(`${newName} changed number from ${oldNum} to ${newNumber}` )
          })
          .catch(() => {
            setColor('red')
            setChangeMessage(`${newName} has been deleted` )
          })
          setTimeout(() =>
            {
              setChangeMessage(null)
            },5000)
            setName('')
            setNumber('')
        }
      }
    }else{
      alert('Cannot leave field empty!')
    }
  } 
  const handleNameChange = (event) => {
    setName(event.target.value)
  }
  const handleNumberChange= (event) =>{
    setNumber(event.target.value)
  }
  const handleSearchChange =(event) =>{
    setSearch(event.target.value)
  }

  const filteredList = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  const deletePerson = (id, name) =>
  {
    if(window.confirm(`Delete ${name}`)){
      fetch(`api/persons/${id}`, { method : 'DELETE' })
      phonebookService
      .getAll()
      .then(personInfo => {
      setPersons(personInfo)
      setColor('black')
      setChangeMessage(`${name} has been deleted from phonebook`)
      setTimeout(() =>
      {
        setChangeMessage(null)
      },5000)
    })
  }

  }
  return (
    <div>
     <h2>Phonebook</h2>
     <DisplayChangeMessage message={changeMessage} messageColor={color} />
     <Search newSearch={newSearch} setSearch={setSearch} handleSearchChange={handleSearchChange} />
    <h2>Add new</h2>
     <AddNewPerson newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
     <h2>Numbers</h2>
     {filteredList.map(person => 
      <DisplayNumbers key={person.id} person={person}  deletePerson={deletePerson} /> )}
    </div>
  )
}
const Search = (props) => 
{
    return(
      <div>filter shown with <input value={props.newSearch} onChange={props.handleSearchChange}  /></div>
    )
}
const AddNewPerson = (props) => {
  return(
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
     </form>
  )
}
const DisplayNumbers = (props) => {

  return(
    <div>
      {props.person.name} : {props.person.number}
      <button onClick={() => props.deletePerson(props.person.id, props.person.name)}>Delete Number</button>
    </div> 
  )
}
const DisplayChangeMessage = (props) =>
{
  const messageStyle = {
    
      color: props.messageColor,
      backgroundColor: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    
  }
  if(props.message === null)
  {
    return null
  }
  return(
    <div style={messageStyle}>
     {props.message}
    </div>
  )
}

export default App
