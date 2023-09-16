import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import { theme } from '../../theme';

const SearchInput = ({ setSearchPhrase }) => {
  const [text, setText] = useState('');

  // Function to handle text input changes
  const handleTextChange = (newText) => {
    setText(newText);
    setSearchPhrase(newText); // Update the parent component's searchPhrase state
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Icon name="search" size={20} color={theme.colors.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          maxLength={10}
          onChangeText={handleTextChange} // Call handleTextChange when text changes
          value={text} // Set the input value to the local state
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  row: {
    backgroundColor: theme.colors.searchBackground,
    flexDirection: 'row',
    borderRadius: 20,
    height: 45,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    paddingHorizontal: 30,
    fontSize: 15,
    height: 45,
    flex: 1,
    color: theme.colors.searchText,
    outlineStyle: 'none',
  },
});

export default SearchInput;
