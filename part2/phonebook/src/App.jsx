import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const Filter = ({query, handleQueryChange}) => {
  return (
    <div>
      filter shown with <input value={query} onChange={handleQueryChange}/>
    </div>
  )
}

const Form = ({persons, setPersons, displayNotification}) => {

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      // personService
      //   .update(
      //     persons.find(person => person.name === newName).id,
      //     { name: newName, number: newNumber }
      //   )
      //   .then(returnedPerson => {
      //     setPersons(
      //       persons.map(person =>
      //         person.id !== returnedPerson.id ? person : returnedPerson
      //       )
      //     )
      //     setNewName('')
      //     setNewNumber('')
      //     displayNotification(`Updated ${returnedPerson.name}'s number to ${returnedPerson.number}`, 'success')
      //   })
      displayNotification(`${newName} is already added to phonebook`, 'error')
    } else {
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewNumber('')
          setNewName('')
          displayNotification(`Added ${returnedPerson.name}`, 'success')
        })
    }
  }

  return (
    <div>
    <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const PersonList = ({persons, handleDelete}) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => {
          return (
          <li key={person.name}>
            {person.name} {person.number} 
            <button onClick={() => handleDelete(person)}>delete</button>
          </li>
          )
        })}
      </ul>
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [query, setQuery] = useState('')
  const [notification, setNotification] = useState({message: null, type: null})
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleDelete = (personToDelete) => {
    if (!window.confirm(`Delete ${personToDelete.name} ?`)) return;

    personService
      .deletePerson(personToDelete.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== personToDelete.id))
        displayNotification(`Removed ${personToDelete.name}`, 'success')
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setPersons(persons.filter(person => person.id !== personToDelete.id))
            console.warn(`Person ${personToDelete.name} was already removed from server`)
            displayNotification(`Person ${personToDelete.name} was already removed from server`, 'error')
          }
          console.error(error.response)
        } else if (error.request) {
          console.error(error.request)
        } else {
          console.error('Error', error.message)
        }
      })
  }

  const displayNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({message: null, type: null})
    }, 3000)
  }

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(query.toLowerCase().trim())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notification.message} type={notification.type} />
      <Filter query={query} handleQueryChange={handleQueryChange} />
      <Form persons={persons} setPersons={setPersons} displayNotification={displayNotification} />
      <PersonList persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  )
}

export default App