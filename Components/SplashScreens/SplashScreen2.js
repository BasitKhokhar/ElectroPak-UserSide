import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const SplashScreen2 = ({ onNext }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/splash-image3`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setImageUrl(data[0].image_url);
        }
      })
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topcontainer}>
      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
      </View>
     
      <Text style={styles.title}>Join Us for a Better Eltric items Experience!</Text>
      <Text style={styles.description}>
        Create an account to explore our wide range of high-quality electric products. Sign up now for an enhanced shopping experience!
      </Text>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Register Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 0,
    backgroundColor: "black",
  },
  topcontainer:{
    width:"100%",
    // height:"30%",
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    padding: 0,
    backgroundColor: "gray",
    borderBottomLeftRadius:100,
    borderBottomRightRadius:100
  },
  image: {
    width: "100%",
    height: "100%", // Takes half of the screen
    resizeMode: "stretch",
    borderBottomLeftRadius:60,
    borderBottomRightRadius:60,
    // marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#10B981",
    marginVertical: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    marginTop:10
  },
  button: {
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 80,
    width:"90%"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SplashScreen2;