import React, {useEffect, useLayoutEffect, useState} from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {AntDesign, FontAwesome} from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import SearchInput from "../components/common/SearchInput";
import Conversations from "../components/Conversations";
import {signOut} from "firebase/auth";
import {auth} from "../config/firebase";
const catImageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home = () => {

    const navigation = useNavigation();

    const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.headerRight}>
                    <Image
                        source={{ uri: catImageUrl }}
                        style={{
                            width: 40,
                            height: 40,
                            marginRight: 15,
                        }}
                     />
                    <TouchableOpacity
                      onPress={onSignOut}
                    >
                      <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
                     </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const [searchPhrase, setSearchPhrase] = useState(""); // Initialize searchPhrase state

    return (
        <View style={styles.container}>
            <SearchInput setSearchPhrase={setSearchPhrase} /> {/* Pass setSearchPhrase */}
            <Conversations searchPhrase={searchPhrase} /> {/* Pass searchPhrase */}
            <View style={styles.chatButtonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Chat")}
                    style={styles.chatButton}
                >
                    <Entypo name="chat" size={24} color={colors.lightGray} />
                </TouchableOpacity>
            </View>
        </View>
    );
    };

    export default Home;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
        },
        chatButton: {
            backgroundColor: colors.primary,
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: .9,
            shadowRadius: 8,
            marginRight: 20,
            marginBottom: 50,
        },
        chatButtonContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 20,
        }
    });