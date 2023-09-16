import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
//import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { nameValidator } from '../helpers/nameValidator'
import {SocialIcon} from "react-native-elements";
import * as Google from "expo-auth-session/providers/google";
import {GoogleAuthProvider, onAuthStateChanged, signInWithCredential} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {Dashboard} from "./index";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })

  const onSignUpPressed = () => {
    const nameError = nameValidator(name.value)
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    })
  }

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

  return userInfo ? <Dashboard/> : (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      <SocialIcon
          button
          fontStyle={{}}
          iconSize={20}
          iconStyle={{}}
          iconType="font-awesome"
          onLongPress={() => console.log("onLongPress()")}
          onPress={() => promptAsync()}
          style={{
              width: '100%',
              marginVertical: 50,
              borderRadius: 20,
              shadowOpacity: 0,
          }}
          title="Sign Up with Google"
          type="google"
      />
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
