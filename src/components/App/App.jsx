import { useState, useEffect, useRef } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { Form } from 'components/Form';
import { Contacts } from 'components/Contacts';
import { Filter } from 'components/Filter';
import { Container, MainTitle, Title } from './App.styled';

export function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const contactsLocalStorage = localStorage.getItem('contacts');

      if (contactsLocalStorage) {
        setContacts(JSON.parse(contactsLocalStorage));
      }
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (name, number) => {
    console.log(name, number);
    const baseContact = {
      id: nanoid(),
      name,
      number,
    };

    if (
      contacts.find(
        contact => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      alert(`${name} is already in contacts`);
      return;
    }

    return setContacts([baseContact, ...contacts]);
  };

  const onChangeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const geFilteredContacts = () => {
    const normalized = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalized)
    );
  };

  const deleteContacts = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const visibleContents = geFilteredContacts();

  return (
    <Container>
      <MainTitle>Phone book</MainTitle>
      <Form onSubmit={addContact} />
      {contacts.length !== 0 && <Title>Contacts</Title>}
      {contacts.length !== 0 && (
        <Filter value={filter} onChange={onChangeFilter} />
      )}
      <Contacts contacts={visibleContents} onClick={deleteContacts} />
    </Container>
  );
}
App.propTypes = {
  contacts: PropTypes.array,
  filter: PropTypes.string,
};
