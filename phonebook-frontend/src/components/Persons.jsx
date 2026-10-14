const Person = ({ person, onClick }) => {
  return (
    <div>
      {`${person.name} ${person.number} `}
      <button onClick={onClick}>delete</button>
    </div>
  )
}

const Persons = ({ persons, filter, onClick }) => {
  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return <>{filteredPersons.map(person => <Person key={person.id} person={person} onClick={() => onClick(person.id)} />)}</>
}

export default Persons