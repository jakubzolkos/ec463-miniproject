// SearchBar.js
import React from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

const SearchBar = ({clicked, searchPhrase, setSearchPhrase, setClicked}) => {
  return (
    <View style={styles.container}>
      <View
        style={
          clicked
            ? styles.searchBar__clicked
            : styles.searchBar__unclicked
        }
      >
        {/* search Icon */}
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        {/* Input field */}
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {/* cross Icon, depending on whether the search bar is clicked or not */}
        {clicked && (
          <Entypo name="cross" size={20} color="black" style={{ padding: 1 }} onPress={() => {
              setSearchPhrase("")
          }}/>
        )}
      </View>
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginTop: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",

  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#f6f6f6",
    borderRadius: 15,
    alignItems: "stretch",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#f6f6f6",
    borderRadius: 15,
    alignItems: "stretch",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});