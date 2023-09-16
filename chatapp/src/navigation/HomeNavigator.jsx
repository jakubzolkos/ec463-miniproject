import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import ConversationsScreen from "../screens/ConversationsScreen";

import { theme } from "../theme";
const { width } = Dimensions.get("screen");

const NORMAL_TAB_ITEM_WIDTH = width * 0.3;

const Tab = createMaterialTopTabNavigator();

const TabBarIndicator = ({ state }) => {
  const [translateValue, setTranslateValue] = useState(new Animated.Value(NORMAL_TAB_ITEM_WIDTH));

  const [itemWidth, setItemWidth] = useState(NORMAL_TAB_ITEM_WIDTH);

  useEffect(() => {
    slide();
  }, [state]);

  const slide = () => {
    setItemWidth(NORMAL_TAB_ITEM_WIDTH);
    const toValue = state.index * NORMAL_TAB_ITEM_WIDTH;
    Animated.timing(translateValue, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true
    }).start();
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: itemWidth,
        borderBottomColor: theme.colors.white,
        borderBottomWidth: 3,
        bottom: 0,
        transform: [{ translateX: translateValue }]
      }}
    />
  )
}

const MyTabBar = ({ state, descriptors, navigation, position }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        const tabBarItemWidth= NORMAL_TAB_ITEM_WIDTH

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              width: tabBarItemWidth,
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 5,
              height: 40,
            }}
          >
            {route.name === "Camera" ? (
              <Animated.View>
                <Icon name="camera" size={25} color={theme.colors.white} />
              </Animated.View>
            ) : (
              <Animated.Text
                style={{ color: theme.colors.white, fontWeight: "bold" }}
              >
                {label}
              </Animated.Text>
            )}
          </TouchableOpacity>
        );
      })}
      <TabBarIndicator state={state} />
    </View>
  );
};

const HomeNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Conversations"
      tabBar={(props) => <MyTabBar {...props} />}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <Tab.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{
          tabBarLabel: "Disc.",
        }}
      />
      <Tab.Screen name="Stories" component={ConversationsScreen} />
      <Tab.Screen name="Calls" component={ConversationsScreen} />
    </Tab.Navigator>
  );
};

export default HomeNavigator;