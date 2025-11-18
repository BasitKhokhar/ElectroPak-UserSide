import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SplashScreen3 = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate("Login"); // Navigate to the login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fast & Secure Shopping Experience</Text>
      <Text style={styles.description}>
        Enjoy a hassle-free and secure shopping experience with our top-rated sanitary products.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplashScreen3;
