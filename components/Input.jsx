import React, { useContext, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  arrayUnion,
  doc, getDoc,
  serverTimestamp, setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {auth, database, storage} from "../config/firebase"

const Input = ({chatId, uid}) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const handleSend = async () => {
    const currentUser = auth.currentUser;
    console.log(currentUser.uid, chatId, uid);

    // Check if the document exists in userChats for currentUser and uid
    const currentUserChatDoc = doc(database, "userChats", currentUser.uid, chatId);
    const uidChatDoc = doc(database, "userChats", uid, chatId);

    const [currentUserChatDocSnapshot, uidChatDocSnapshot] = await Promise.all([
      getDoc(currentUserChatDoc),
      getDoc(uidChatDoc),
    ]);

    // Create a new message object
    const newMessage = {
      id: uuid(),
      text,
      senderId: currentUser.uid,
      date: Timestamp.now(),
    };

    // Check if the document exists, and use setDoc or updateDoc accordingly
    if (currentUserChatDocSnapshot.exists() && uidChatDocSnapshot.exists()) {
      // Both documents exist, use updateDoc for both
      await Promise.all([
        updateDoc(currentUserChatDoc, {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        }),
        updateDoc(uidChatDoc, {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        }),
      ]);
    } else {
      // At least one of the documents doesn't exist, use setDoc for both
      await Promise.all([
        setDoc(currentUserChatDoc, {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        }),
        setDoc(uidChatDoc, {
          [chatId + ".lastMessage"]: {
            text,
          },
          [chatId + ".date"]: serverTimestamp(),
        }),
      ]);
    }

    // Add the message to the "chats" collection
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          // TODO: Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(database, "chats", chatId), {
              messages: arrayUnion({
                ...newMessage,
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(database, "chats", chatId), {
        messages: arrayUnion(newMessage),
      });
    }

    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;