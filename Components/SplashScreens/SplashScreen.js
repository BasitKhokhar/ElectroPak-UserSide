import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import colors from "../../Themes/colors"; // <-- import your colors file

const SplashScreen = ({ navigation }) => {
  const fullText =
    "Welcome to ElectroPak App — Where you can buy Electric items and book services.";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);

    const timeout = setTimeout(() => {
      navigation.replace("Main");
    }, 7000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.bodybackground }]}
    >
      <Animatable.Text
        animation="fadeIn"
        duration={2000}
        style={[styles.welcomeText, { color: colors.primary }]}
      >
        {displayedText}
      </Animatable.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 15 },
  welcomeText: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
});

export default SplashScreen;
