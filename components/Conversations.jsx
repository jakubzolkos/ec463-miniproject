import React, { useContext, useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import ConversationItem from './ConversationItem';
import { auth, database } from '../config/firebase';
import {ScrollView} from "react-native";

const Conversations = ({ searchPhrase }) => {
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const handleSearch = async () => {
    if (!searchPhrase) {
      return;
    }

    const q = query(collection(database, 'users'), where('username', '==', searchPhrase));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  useEffect(() => {
    handleSearch().then(r => {});
  }, [searchPhrase]);

  return (
    <ScrollView>
      {user && <ConversationItem key={user.uid} uid={user.uid} username={user.username} picture={user.avatar} />}
    </ScrollView>
  );
};

export default Conversations;
