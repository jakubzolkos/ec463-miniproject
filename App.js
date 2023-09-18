import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import {onAuthStateChanged, signOut} from 'firebase/auth';
import { auth } from './config/firebase';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Chat from './screens/Chat';
import Home from './screens/Home';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AntDesign, Ionicons} from "@expo/vector-icons";
import { Image } from 'react-native';
import Friends from "./screens/Friends";

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const AuthenticatedUserContext = createContext({});

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function HomeStack() {
  const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
  };
  const avatar = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Chats'
        component={TabNavigator}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#7415da',
          },
          headerLeft: () => (
            <View style={{ marginLeft: 25 }}>
              <Image
                source={{ uri: avatar }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
              />
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 25 }}>
              <TouchableOpacity>
                <Ionicons
                  name="search"
                  size={26}
                  color="white"
                  style={{ marginRight: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="settings-outline"
                  size={26}
                  color="white"
                  style={{ marginRight: 30 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onSignOut(navigation)}>
                <AntDesign
                  name="logout"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name='Chat'
        component={Chat}
        options={{
          headerShown: true,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
          },
          headerStyle: {
            backgroundColor: '#7415da',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Chats') {
            iconName = 'chat'; // You can replace 'chat' with the actual icon name you want to use
          } else if (route.name === 'Friends') {
            iconName = 'account-group'; // Replace with the Friends icon
          }
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#7415da',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#7415da',
        },
      })}
    >
      <Tab.Screen name='Chats' component={Home} />
      <Tab.Screen name='Friends' component={Friends} />
    </Tab.Navigator>
  );
}


function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

function RootNavigator() {

  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <HomeStack />: <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthenticatedUserProvider>
        <RootNavigator />
      </AuthenticatedUserProvider>
    </SafeAreaProvider>
  );
}