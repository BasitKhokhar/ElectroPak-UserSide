import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { colors } from "../../Themes/colors"; 

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^\d{11}$/.test(phone);

  const validateInputs = () => {
    if (!name || !email || !password || !phone || !city) {
      Alert.alert("Error", "All fields are required!");
      return false;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Invalid email format!");
      return false;
    }
    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Phone number must be exactly 11 digits!");
      return false;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (!validateInputs()) return;

    fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, city }),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert("Success", "Signup successful! Please log in.");
        navigation.navigate("Login");
      })
      .catch(() => Alert.alert("Error", "Signup failed"));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <View style={[styles.formContainer, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>

        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          keyboardType="email-address"
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="Phone Number (11 digits)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.mutedText}
        />

        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          placeholderTextColor={colors.mutedText}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSignup}>
          <Text style={[styles.buttonText, { color: "#fff" }]}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.link, { color: colors.accent }]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  formContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 22,
    textAlign: "center",
  },

  input: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 18,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    textAlign: "center",
    marginTop: 18,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default SignupScreen;
