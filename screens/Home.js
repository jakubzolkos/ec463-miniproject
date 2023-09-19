import React, { useContext, useEffect, useState } from "react";
import {View, StyleSheet, ScrollView} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SearchInput from "../components/common/SearchInput";
import { auth, database } from "../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../components/ChatContext";
import ConversationItem from "../components/ConversationItem";
const catImageUrl =
  "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";

const Home = () => {
  const navigation = useNavigation();
  const [searchPhrase, setSearchPhrase] = useState("");
  const [chats, setChats] = useState(null);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(database, "userChats", auth.currentUser.uid),
        (doc) => {
          setChats(doc.data());
          console.log(doc.data())
        }
      );

      return () => {
        unsub();
      };
    };

    if (auth.currentUser.uid) {
      getChats();
    }
  }, [auth.currentUser.uid]);

  return (
    <View style={styles.container}>
      <SearchInput setSearchPhrase={setSearchPhrase} />
        <ScrollView>
          {chats &&
            Object.entries(chats)
              .sort(([, a], [, b]) => b.date - a.date) // Destructure the objects properly
              .map(([chatId, chatData]) => (
                <ConversationItem
                  key={chatId}
                  username={chatData.userInfo.username}
                  picture={chatData.userInfo.avatar}
                />
              ))}
        </ScrollView>
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