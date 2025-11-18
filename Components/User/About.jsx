import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Loader from '../Loader/Loader';
import Constants from 'expo-constants';
import { colors } from "../../Themes/colors";   // ✅ IMPORT THEME

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function About() {

  const [aboutData, setAboutData] = useState({
    aboutMsgsData: [],
    aboutImageData: [],
    aboutUsData: [],
    aboutMissionData: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const apiEndpoints = [
      { key: 'aboutMsgsData', url: `${API_BASE_URL}/about` },
      { key: 'aboutImageData', url: `${API_BASE_URL}/about_image` },
      // { key: 'aboutUsData', url: `${API_BASE_URL}/aboutus` },
      { key: 'aboutMissionData', url: `${API_BASE_URL}/about_mission` }
    ];

    Promise.all(
      apiEndpoints.map(endpoint =>
        fetch(endpoint.url)
          .then(response => response.json())
          .then(data => ({ key: endpoint.key, data }))
          .catch(() => ({ key: endpoint.key, data: [] }))
      )
    ).then(results => {
      const updatedData = results.reduce((acc, result) => {
        acc[result.key] = result.data;
        return acc;
      }, {});
      setAboutData(prev => ({ ...prev, ...updatedData }));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bodybackground }]}>

      <Animatable.Text animation="fadeInUp" style={[styles.title, { color: colors.text }]}>
        About Us
      </Animatable.Text>

      {/* ABOUT US SECTION */}
      <View style={styles.section}>
        {/* <Animatable.View animation="zoomIn" style={styles.imageContainer}>
          {aboutData.aboutImageData.map(item => (
            <Image key={item.id} source={{ uri: item.image_url }} style={styles.image} />
          ))}
        </Animatable.View> */}

        <Animatable.View animation="fadeInUp" style={styles.textContainer}>
          {aboutData.aboutUsData.map(items => (
            <Text key={items.id} style={[styles.text, { color: colors.text }]}>
              {items.about_us}
            </Text>
          ))}
        </Animatable.View>
      </View>

      {/* Mission & Vision */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Mission & Vision</Text>

      <View style={styles.section}>
        {aboutData.aboutMissionData.map(items => (
          <Animatable.View
            key={items.id}
            animation="zoomIn"
            style={[styles.missionContainer, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.missionText, { color: "#FFF" }]}>{items.aboutmission}</Text>
          </Animatable.View>
        ))}
      </View>

      {/* Owners List */}
      {/* {aboutData.aboutMsgsData.map(items => (
        <View key={items.id} style={styles.ownerContainer}>
          <Animatable.Text
            animation="fadeInUp"
            style={[
              styles.position,
              { backgroundColor: colors.accent, color: "#FFF" }
            ]}
          >
            {items.Position}
          </Animatable.Text>

          <View style={styles.ownerDetails}>
            <Animatable.Image
              animation="zoomIn"
              source={{ uri: items.image_url }}
              style={[styles.ownerImage, { borderColor: colors.border }]}
            />

            <View>
              <Text style={[styles.ownerName, { color: colors.text }]}>{items.name}</Text>

              <Text style={[styles.text, { color: colors.mutedText }]}>
                {items.description}
              </Text>

              <Text style={[styles.contact, { color: colors.text }]}>
                <Text style={styles.bold}>Contact:</Text> {items.contact}
              </Text>
            </View>
          </View>
        </View>
      ))} */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 55,
  },

  loaderContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    width: '100%', height: '100%', borderRadius: 10,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },

  section: { gap: 10, marginBottom: 20 },

  imageContainer: { alignItems: 'center' },

  image: {
    width: '100%',
    height: 350,
    borderRadius: 10,
  },

  textContainer: { paddingHorizontal: 10 },

  text: {
    fontSize: 16,
    textAlign: 'justify',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },

  missionContainer: {
    padding: 15,
    borderRadius: 8,
  },

  missionText: {
    fontSize: 16,
    textAlign: 'justify',
  },

  ownerContainer: {
    marginBottom: 100,
  },

  position: {
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },

  ownerDetails: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  ownerImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
  },

  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  contact: { fontSize: 16, marginTop: 5 },

  bold: { fontWeight: 'bold' },
});
