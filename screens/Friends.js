import React, {useEffect, useLayoutEffect, useState} from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {AntDesign, FontAwesome, Ionicons} from '@expo/vector-icons';
import colors from '../colors';
import { Entypo } from '@expo/vector-icons';
import SearchInput from "../components/common/SearchInput";
import Conversations from "../components/Conversations";
import {signOut} from "firebase/auth";
import {auth} from "../config/firebase";
import UserSearch from "../components/UserSearch";
const catImageUrl = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";

const Home = () => {

    const navigation = useNavigation();
    const [searchPhrase, setSearchPhrase] = useState("");

    return (
        <View style={styles.container}>
            <SearchInput setSearchPhrase={setSearchPhrase} />
            <UserSearch searchPhrase={searchPhrase} />
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
            backgroundColor: "#7415da",
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: "#7415da",
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
        },
          headerLeft: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
            marginLeft: 20,
        },

    });