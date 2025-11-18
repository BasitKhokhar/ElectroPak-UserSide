import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { colors } from "../../Themes/colors"; // ✅ THEME

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateInputs = () => {
    setEmailError(!isValidEmail(email));
    setPasswordError(password.length < 8);
    return isValidEmail(email) && password.length >= 8;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.userId && data.email && data.token) {
          await SecureStore.setItemAsync("jwt_token", data.token);
          await AsyncStorage.setItem("userId", data.userId.toString());
          await AsyncStorage.setItem("email", data.email);
          navigation.replace("SplashScreen");
        } else {
          Alert.alert("Error", "Invalid credentials");
        }
      })
      .catch(() => Alert.alert("Error", "Login failed"));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>

      <View style={[styles.card, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>

        <Text style={[styles.title, { color: colors.text }]}>Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.mutedText}
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
            emailError && { borderColor: colors.error },
          ]}
          keyboardType="email-address"
        />

        {emailError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Invalid email format
          </Text>
        )}

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.mutedText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.text },
            passwordError && { borderColor: colors.error },
          ]}
        />

        {passwordError && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Password must be at least 8 characters
          </Text>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={[styles.link, { color: colors.accent }]}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
  },

  card: {
    padding: 25,
    borderRadius: 14,
    borderWidth: 1.2,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    padding: 13,
    paddingLeft: 15,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },

  errorText: {
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginScreen;
