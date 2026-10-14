import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, color: 'green' })

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const notUniqueName = persons.map(person => person.name).includes(newName)

    if (notUniqueName) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber }
        
        personService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === personToUpdate.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
            setNotification({ message: `Updated ${returnedPerson.name}'s number`, color: 'green' })
            setTimeout(() => setNotification({ ...notification, message: null }), 5000)
          })
          .catch(error => {
            setNotification({ message: `Information of ${personToUpdate.name} has already been removed from server`, color: 'red' })
            setTimeout(() => setNotification({ ...notification, message: null }), 5000)
            setPersons(persons.filter(person => person.id !== personToUpdate.id))
          })
      }
    } else {
      const personObject = { name: newName, number: newNumber }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({ message: `Added ${returnedPerson.name}`, color: 'green' })
          setTimeout(() => setNotification({ ...notification, message: null }), 5000)
        })
    }
  }

  const removePerson = id => {
    const personToRemove = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${personToRemove.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setNotification({ message: `Information of ${personToRemove.name} has already been removed from server`, color: 'red' })
          setTimeout(() => setNotification({ ...notification, message: null }), 5000)
          setPersons(persons.filter(person => person.id !== personToRemove.id))
        })
    }
  }

  const handleNameChange = event => setNewName(event.target.value)

  const handleNumberChange = event => setNewNumber(event.target.value)

  const handleFilterChange = event => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} color={notification.color} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm name={newName} onNameChange={handleNameChange} number={newNumber} onNumberChange={handleNumberChange} onSubmit={addPerson} />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} onClick={removePerson} />
    </div>
  )
}

export default App