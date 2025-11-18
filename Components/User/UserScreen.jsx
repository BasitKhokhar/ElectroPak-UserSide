import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import SocialIconsRow from "./SocialIconsRow";
import Loader from "../Loader/Loader";
import Constants from 'expo-constants';
import colors from "../../Themes/colors";  

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserScreen = () => {
  const [userData, setUserData] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");

      if (storedUserId) {
        const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setUserData(data);

        const imageResponse = await fetch(`${API_BASE_URL}/user_images/${storedUserId}`);
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          setUserImage(imageData.image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching user data or image:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
    setRefreshing(false);
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: colors.primary }]}>
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: colors.bodybackground }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : userData ? (
          <View style={styles.profileContainer}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>{userData.name}</Text>

              <View style={styles.imageContainer}>
                {userImage && userImage.startsWith('http') ? (
                  <Image
                    source={{ uri: userImage }}
                    style={styles.profileImage}
                  />
                ) : (
                  <View style={[styles.defaultProfileCircle, { borderColor: colors.primary }]} />
                )}
              </View>
            </View>

            {/* Sections */}
            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("AccountDetail", { userData })}>
              <View style={styles.sectionRow}>
                <Icon name="person" size={24} color={colors.primary} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.text }]}>Account Detail</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("CustomerSupport")}>
              <View style={styles.sectionRow}>
                <Icon name="support-agent" size={24} color={colors.primary} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.text }]}>Customer Support</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("faq")}>
              <View style={styles.sectionRow}>
                <Icon name="help-outline" size={24} color={colors.primary} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.text }]}>FAQs</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.section} onPress={() => navigation.navigate("about")}>
              <View style={styles.sectionRow}>
                <Icon name="info" size={24} color={colors.primary} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.text }]}>About</Text>
              </View>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={[styles.section, styles.logout]} onPress={() => navigation.navigate("Logout")}>
              <View style={styles.sectionRow}>
                <Icon name="logout" size={24} color={colors.error} style={styles.icon} />
                <Text style={[styles.sectionText, { color: colors.error }]}>Logout</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.iconscontainer}>
              <SocialIconsRow />
            </View>

          </View>
        ) : (
          <Text style={[styles.text, { color: colors.mutedText }]}>No user data found.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    paddingTop: 30,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  profileContainer: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 50,
    justifyContent: "space-between",
    width: "100%",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  section: {
    width: "100%",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 18,
  },
  icon: {
    marginRight: 10,
  },
  logout: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  iconscontainer: {
    marginTop: 0,
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden"
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50
  },
  defaultProfileCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: colors.cardsbackground,
  }
});

export default UserScreen;
