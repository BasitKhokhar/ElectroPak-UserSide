import React, { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import SignupScreen from "./Components/Authentication/Signup";
import LoginScreen from "./Components/Authentication/Login";
import HomeScreen from "./Components/Home";
import ProductsScreen from "./Components/Products/ProductsScreen";
import CartScreen from "./Components/Cart/CartScreen";
import CheckoutScreen from "./Components/Cart/CheckoutScreen";
import AddressScreen from "./Components/Cart/AddressScreen";
import PaymentScreen from "./Components/Cart/PaymentScreen";
import Categories from "./Components/Categories/Categories";
import Subcategories from "./Components/Categories/Subcategories";
import Products from "./Components/Categories/Products";
import SearchScreen from "./Components/Products/SearchScreen";
import SplashScreen from "./Components/SplashScreens/SplashScreen";
import SplashScreen1 from "./Components/SplashScreens/SplashScreen1";
import SplashScreen2 from "./Components/SplashScreens/SplashScreen2";
import UserDetailsScreen from "./Components/Cart/UserDetailsScreen";

import OrdersList from "./Components/Cart/OrderStatus";
import BookingForm from "./Components/Services/BookingForm";
import UserScreen from "./Components/User/UserScreen";
import AccountDetailScreen from "./Components/User/AccountDetailScreen";
import CustomerSupportScreen from "./Components/User/CustomerSupportScreen";
import FAQ from "./Components/User/FAQ";
import Services from "./Components/Services/Services";
import About from "./Components/User/About";
import StripePayment from "./Components/Cart/StripePayment";
import LogoutScreen from "./Components/User/LogoutScreen";

import logoImage from "./assets/logo2.png";
import colors from "./Themes/colors";
import 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const stripeKey = Constants.expoConfig.extra.stripePublishableKey;
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainLayout = ({ navigation, children, currentScreen }) => {


  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Image source={logoImage} style={styles.logo} />
        <View style={{flexDirection:'row',gap:10}}>
          <TouchableOpacity
            style={[styles.searchBar, { backgroundColor: colors.cardsbackground }]}
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Icon name="search" size={20} color={colors.primary} style={styles.searchIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.searchBar, { backgroundColor: colors.cardsbackground }]}
            onPress={() => navigation.navigate("Orderstatus")}
          >
            <Icon name="notifications" size={20} color={colors.primary} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.body}>{children}</View>
      <View style={styles.footercontainer}>
        <View style={[styles.footer, { backgroundColor: colors.cardsbackground, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 10 }]}>
          {[
            { name: "Home", icon: "home" },
            { name: "Cart", icon: "shopping-cart" },
            { name: "Services", icon: "build" },
            { name: "Profile", icon: "person" },
          ].map(({ name, icon }) => {
            const isActive = currentScreen === name;
            return (
              <TouchableOpacity
                key={name}
                style={styles.footerButton}
                onPress={() => navigation.navigate(name)}
              >
                <Icon
                  name={icon}
                  size={24}
                  color={isActive ? colors.primary : colors.mutedText}
                />
                <Text style={[styles.footerText, { color: isActive ? colors.primary : colors.mutedText }]}>
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>


    </View>
  );
};

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Home">
            <HomeScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Products">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Products">
            <ProductsScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Cart">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Cart">
            <CartScreen />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Services">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Services">
            <Services />
          </MainLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {({ navigation }) => (
          <MainLayout navigation={navigation} currentScreen="Profile">
            <UserScreen />
          </MainLayout>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const commonHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.cardsbackground, borderBottomWidth: 1, borderColor: colors.border
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: "bold",
  },
};

const App = () => {
  const [userId, setUserId] = useState(null);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isSplash1Visible, setIsSplash1Visible] = useState(true);
  const [isSplash2Visible, setIsSplash2Visible] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt_token");
        const storedUserId = await AsyncStorage.getItem("userId");
        if (token && storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error checking login:", error);
      } finally {
        setCheckingLogin(false);
      }
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const splashFlow = async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsSplash1Visible(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsSplash2Visible(false);
    };
    splashFlow();
  }, []);

  if (isSplash1Visible) return <SplashScreen1 />;
  if (isSplash2Visible) return <SplashScreen2 onNext={() => setIsSplash2Visible(false)} />;
  if (checkingLogin) return <SplashScreen />;

  return (
    <StripeProvider
      publishableKey={stripeKey}
      merchantDisplayName="Basit Sanitary App"
    >
      <NavigationContainer>
        <Stack.Navigator initialRouteName={userId ? "Main" : "Login"}>
          <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} setUserId={setUserId} />}
          </Stack.Screen>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {(props) => <BottomTabs {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: "Checkout", ...commonHeaderOptions, }} />
          <Stack.Screen name="AddressScreen" component={AddressScreen}/>
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: "Payment Methods", ...commonHeaderOptions, }}/>
           <Stack.Screen name="Orderstatus" component={OrdersList} options={{ title: "All Notifications", ...commonHeaderOptions, }}/>
          <Stack.Screen name="Profile" component={UserScreen} options={{ title: "Profile" }} />
          <Stack.Screen name="BookingForm" component={BookingForm} options={{ title: "Book Electrician", ...commonHeaderOptions, }} />
          <Stack.Screen name="Categories" component={Categories} />
          <Stack.Screen name="Subcategories" component={Subcategories} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: "Search Products", ...commonHeaderOptions, }} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="UserDetailsScreen" component={UserDetailsScreen} />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: "Profile Update", ...commonHeaderOptions, }} />
          <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} options={{ title: "Customer Support", ...commonHeaderOptions, }} />
          <Stack.Screen name="faq" component={FAQ} options={{ title: "FAQs", ...commonHeaderOptions, }} />
          <Stack.Screen name="about" component={About} options={{ title: "About", ...commonHeaderOptions, }}/>
          <Stack.Screen name="StripePayment" component={StripePayment} options={{ title: "Payment", ...commonHeaderOptions, }}/>
          <Stack.Screen name="Logout" component={LogoutScreen} options={{ title: "Logout", ...commonHeaderOptions, }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 30,
    paddingHorizontal: 16, paddingBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: { width: 150, height: 50, resizeMode: "contain" },
  searchBar: {
    paddingHorizontal: 10, paddingVertical: 10,
    borderRadius: 20,
  },
  searchText: { flex: 1 },
  // searchIcon: { marginLeft: 5 },
  body: { flex: 1, padding: 0 },
  footercontainer: {
    marginHorizontal: 10, marginBottom: 10
  },
  footer: {
    flexDirection: "row",
    justifyContent: 'space-evenly',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderRadius: 50,
  },
  footerButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },

  cartBadge: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
