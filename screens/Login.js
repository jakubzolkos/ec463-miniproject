
import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
const backImage = require("../assets/backImage.png");
import { SocialIcon } from 'react-native-elements'
import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential
} from 'firebase/auth'
import {collection, getFirestore} from "firebase/firestore";
import Logo from "../components/auth/Logo";

WebBrowser.maybeCompleteAuthSession()


export default function Login({ navigation }) {
  const catImageUrl = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
  // Google authentication

  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: "id_token",
    webClientId: "194340734719-f8itgbip10m9n67b1upsh1vt7bef3869.apps.googleusercontent.com",
    iosClientId: "194340734719-3hvuk7trb57l1l8obsjvrfhfl2s4ll8t.apps.googleusercontent.com",
    androidClientId: "194340734719-gvq5c6b1usetpb29ot31pvqlmpkj4l5d.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((userCredential) => {
        const user = userCredential.user;
        const usersRef = collection(database, "users");
        const userQuery = doc(usersRef, user.email);

        getDoc(userQuery)
          .then((docSnap) => {
            if (docSnap.exists()) {
              // User with this email already exists, do nothing
              console.log("User already exists in the 'users' collection.");
            } else {
              const userData = {
                username: user.displayName,
                email: user.email,
                uid: user.uid,
                avatar: catImageUrl,
              };

              setDoc(userQuery, userData)
                .then(() => {
                  console.log("New user added to the 'users' collection.");
                })
                .catch((error) => {
                  console.error("Error adding new user:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error checking if user exists:", error);
          });
      });
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user);
        setUserInfo(user);
      } else {
        console.log("User not authorized");
      }
    });

    return () => unsub();
  }, []);

  // Standard authentication

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success"))
        .catch((err) => Alert.alert("Login error", err.message));
    }
  };
  
  return userInfo ? navigation.navigate("Home") : (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Logo/>
        <Text style={styles.title}>Log In</Text>
         <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoFocus={true}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Log In</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={{color: '#7415da', fontWeight: '600', fontSize: 14}}> Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={{
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        }}>
        <SocialIcon
          button
          fontStyle={{fontSize: 16, fontWeight: '600'}}
          iconStyle={{}}
          iconType="font-awesome"
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => promptAsync()}
          style={{
              width: '100%',
              marginVertical: 50,
              borderRadius: 10,
              shadowOpacity: 0,
          }}
          title="Log In With Google"
          type="google"
        />
      </TouchableOpacity>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#7415da",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    outlineColor: '#7415da',
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: 'cover',
  },
  whiteSheet: {
    width: '100%',
    height: '75%',
    position: "absolute",
    bottom: 0,
    backgroundColor: '#fff',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: '#7415da',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
