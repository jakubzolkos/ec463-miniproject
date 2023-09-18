import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithCredential
} from 'firebase/auth';
import { auth, database } from '../config/firebase';
import {SocialIcon} from "react-native-elements";
import {addDoc, collection} from "firebase/firestore";
import * as Google from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Logo from "../components/auth/Logo";
WebBrowser.maybeCompleteAuthSession()

export default function Signup({ navigation }) {

  // Google authentication

  const [userInfo, setUserInfo] = useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
      responseType: "id_token",
      webClientId: "194340734719-f8itgbip10m9n67b1upsh1vt7bef3869.apps.googleusercontent.com",
      iosClientId: "194340734719-3hvuk7trb57l1l8obsjvrfhfl2s4ll8t.apps.googleusercontent.com",
      androidClientId: "194340734719-gvq5c6b1usetpb29ot31pvqlmpkj4l5d.apps.googleusercontent.com",
  });

  React.useEffect(() => {
      if (response?.type === "success") {
          const { id_token } = response.params;
          const credential = GoogleAuthProvider.credential(id_token);
          signInWithCredential(auth, credential).then(r => {});
          console.log(response.params)
      }
  }, [response])

  React.useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log(JSON.stringify(user, null, 2));
            setUserInfo(user);
          } else {
              console.log("User not authorized");
          }
      });

      return () => unsub();
  }, []);

  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [username, setUsername] = useState('')
  const catImageUrl = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";

  const onHandleSignup = () => {
    if (email !== '' && username !== '' && (password1 === password2)) {
    createUserWithEmailAndPassword(auth, email, password1)
      .then((userCredential) => {
        const user = userCredential.user;
        const userUID = user.uid;
        const userDocRef = collection(database, 'users');
        const userData = {
          email: email,
          username: username,
          uid: userUID,
          avatar: catImageUrl,
        };

        addDoc(userDocRef, userData)
          .then(() => {
            console.log('Signup success');
          })
          .catch((err) => {
            console.error('Error adding user data:', err);
          });
      })
      .catch((err) => {
        console.error('Signup error:', err.message);
      });
    }
  };

  return userInfo ? navigation.navigate("Home") : (
    <View style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
      <Logo/>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        autoFocus={true}
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
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
        value={password1}
        onChangeText={(text) => setPassword1(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Re-enter password"
        placeholderTextColor="#AAAAAA"
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={true}
        textContentType="password"
        value={password2}
        onChangeText={(text) => setPassword2(text)}
      />
      <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
        <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Sign Up</Text>
      </TouchableOpacity>
      <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{color: '#7415da', fontWeight: '600', fontSize: 14}}> Log In</Text>
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
          title="Sign Up With Google"
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
    fontSize: 36,
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