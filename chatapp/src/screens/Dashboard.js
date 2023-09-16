import Button from '../components/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig'
import { Searchbar } from 'react-native-paper';
import { Feather, Entypo } from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";


const HomeScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'StartScreen' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);

    useEffect(() => {
        fetchData("https://randomuser.me/api/?results=10").then(r => {});
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerLargeTitle: true,
            headerTitle: "Home",
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate("Stack")}
                    style={{
                        backgroundColor: "purple",
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            textAlign: "center",
                            color: "white",
                        }}
                    >+</Text>
                </TouchableOpacity>
            ),
            headerSearchBarOptions: {
                placeholder: "Friends",
                onChangeText: (event) => {
                    searchFilterFunction(event.nativeEvent.text);
                },
            },
        });
    }, [navigation]);

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json.results);
            setFilteredData(json.results);
            console.log(json.results);
        } catch (error) {
            console.error(error);
        }
    };

    const searchFilterFunction = (text) => {
        if(text){
            const newData = data.filter(item => {
                const itemData = item.name.first ? item.name.first.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredData(newData);
        } else {
            setFilteredData(data);
        }
    }

    return (
        <ScrollView style={styles.container}>
          <Button mode="outlined" onPress={handleLogout}>Logout</Button>
          <Searchbar
            searchPhrase={searchPhrase}
            setSearchPhrase={setSearchPhrase}
            clicked={clicked}
            setClicked={setClicked}
            style={styles.searchbar}
          />
            <Text style={styles.textFriends}>{filteredData.length} Friends</Text>
            {
                filteredData.map((item, index) => {
                    return (
                        <View key={index} style={styles.itemContainer}>
                            <Image
                                source={{ uri: item.picture.large }}
                                style={styles.image}
                            />
                            <View>
                                <Text style={styles.textName}>{item.name.first} {item.name.last}</Text>
                                <Text style={styles.textEmail}>{item.login.username}</Text>
                            </View>
                        </View>
                    )
                })
            }
        </ScrollView>
    );
  }

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    textFriends: {
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 20,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",
    },
    textEmail: {
        fontSize: 14,
        marginLeft: 10,
        color: "grey",
    },
    searchbar: {
        marginBottom: 10,
        backgroundColor: '#efefef',
    }
});