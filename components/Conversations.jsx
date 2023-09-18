import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';

import ConversationItem from './ConversationItem';
import { auth, database } from '../config/firebase';
import { useNavigation } from "@react-navigation/native";

const Conversations = ({ searchPhrase }) => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to query Firestore based on the searchPhrase
    const queryFirestore = async () => {
      try {
        const usersRef = collection(database, 'users');

        // Query for usernames
        const usernameQuery = query(usersRef,
          where('username', '>=', searchPhrase),
          where('username', '<=', searchPhrase + '\uf8ff')
        );

        const usernameSnapshot = await getDocs(usernameQuery);
        const usernameData = usernameSnapshot.docs.map((doc) => doc.data());

        // Query for emails
        const emailQuery = query(usersRef,
          where('email', '>=', searchPhrase),
          where('email', '<=', searchPhrase + '\uf8ff')
        );

        const emailSnapshot = await getDocs(emailQuery);
        const emailData = emailSnapshot.docs.map((doc) => doc.data());

        // Merge the results
        const mergedData = [...usernameData, ...emailData];

        // Deduplicate the merged data by uid
        const uniqueData = mergedData.reduce((acc, user) => {
          if (!acc.find((item) => item.uid === user.uid)) {
            acc.push(user);
          }
          return acc;
        }, []);

        // Sort the unique data alphabetically by username
        const sortedData = uniqueData.sort((a, b) => a.username.localeCompare(b.username));

        // Get the UID of the currently logged-in user (Assuming you have access to it)
        const loggedInUserUID = auth.currentUser.uid;

        // Filter out the currently logged-in user
        const filteredUsers = sortedData.filter(user => user.uid !== loggedInUserUID);

        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error querying Firestore: ', error);
      }
    };

    // Call the queryFirestore function when searchPhrase changes
    queryFirestore().then(r => {});
  }, [searchPhrase]);

  return (
    <ScrollView>
      {users.map((user) => (
        <ConversationItem
          key={user.uid}
          picture={user.avatar}
          username={user.username}
          // Add other props as needed (isBlocked, isMuted, hasStory)
        />
      ))}
    </ScrollView>
  );
};

export default Conversations;
