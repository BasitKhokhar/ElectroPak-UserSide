import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Alert } from 'react-native';
import Loader from '../Loader/Loader';
import colors from '../../Themes/colors';
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const Services = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [servicesData, setServicesData] = useState([]);
  const [plumbersData, setPlumbersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);

  const fetchData = async () => {
    try {
      const [servicesRes, plumbersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/services`).then(res => res.json()),
        fetch(`${API_BASE_URL}/plumbers`).then(res => res.json())
      ]);
      setServicesData(servicesRes);
      setPlumbersData(plumbersRes);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      if (id) setLoginUserId(id);
    } catch (error) {
      console.error('Failed to get userId from storage', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    getUserId();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  return (
    <View style={{ paddingBottom: 110, backgroundColor: colors.bodybackground }}>
      <FlatList
        key={"single-column"}
        data={plumbersData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        refreshing={refreshing}
        onRefresh={handleRefresh}

        ListHeaderComponent={
          <View style={styles.maincontainer}>
            <View style={[styles.servicescontainer, { backgroundColor: colors.bodybackground }]}>

              <Text style={[styles.heading, { color: colors.text }]}>Services</Text>
              <Text style={[styles.subHeading, { color: colors.text }]}>Explore Our Services</Text>

              <View style={styles.serviceContainer}>
                <View style={styles.navContainer}>
                  {servicesData.map((service, index) => (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.navButton,
                        { borderColor: colors.border, backgroundColor: colors.cardsbackground },
                        activeTab === index && { backgroundColor: colors.accent }
                      ]}
                      onPress={() => setActiveTab(index)}
                    >
                      <Text style={[styles.navText, activeTab === index && { color: colors.bodybackground }]}>
                        {service.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.contentContainer}>
                  {servicesData.length > 0 && (
                    <View>
                      <Image source={{ uri: servicesData[activeTab].image }} style={styles.image} />
                      <Text style={[styles.serviceTitle, { color: colors.primary }]}>
                        10+ Years Of Experience In Electricity & Electrician Services
                      </Text>
                      <Text style={[styles.serviceDescription, { color: colors.mutedText }]}>
                        {servicesData[activeTab].description}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={[styles.subHeading, { color: colors.text }]}>Our Electicians</Text>
            </View>
          </View>
        }

        renderItem={({ item }) => (
          <View style={styles.cardscontainer}>
            <View style={[styles.card, { backgroundColor: colors.cardsbackground, borderColor: colors.border }]}>

              <View style={styles.cardimage}>
                <Image source={{ uri: item.image_url }} style={styles.plumberImage} />
              </View>

              <View style={styles.cardright}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Name: {item.name}</Text>
                <Text style={[styles.cardText, { color: colors.mutedText }]}>Contact: {item.contact}</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.status,
                      { color: item.status.toLowerCase() === 'free' ? 'green' : colors.error }
                    ]}
                  >
                    {item.status}
                  </Text>

                  {/* ✅ Show BOOK button only if status is FREE */}
                  {item.status.toLowerCase() === "free" && (
                    <TouchableOpacity
                      style={styles.bookButton}
                      onPress={() => {
                        if (!loginUserId) {
                          Alert.alert('Error', 'User not logged in');
                          return;
                        }
                        navigation.navigate('BookingForm', {
                          technicianId: item.id,
                          techuserID: item.id,
                          loginUserId: loginUserId,
                        });
                      }}
                    >
                      <Text style={styles.bookButtonText}>Book</Text>
                    </TouchableOpacity>
                  )}
                </View>

              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', borderRadius: 10,
  },
  maincontainer: { paddingTop: 30 },
  servicescontainer: { borderTopLeftRadius: 0, borderTopRightRadius: 70, paddingBottom: 20 },
  heading: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subHeading: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10, textAlign: 'center' },
  serviceContainer: { flexDirection: 'column', marginBottom: 20, padding: 15 },
  navContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, gap: 10 },
  navButton: { padding: 10, width: '31%', borderWidth: 2, borderRadius: 10 },
  navText: { fontSize: 16, textAlign: 'center' },
  contentContainer: { width: '100%' },
  image: { width: '100%', height: 150, borderRadius: 10 },
  serviceTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  serviceDescription: { fontSize: 14, marginTop: 5 },

  card: { flexDirection: 'row', gap: 15, padding: 10, marginHorizontal: 15, borderWidth: 1, borderRadius: 8, margin: 5, alignItems: 'center' },
  cardright: { flex: 1 },
  plumberImage: { width: 100, height: 100, borderRadius: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardText: { fontSize: 14 },
  status: { fontWeight: '800' },

  bookButton: {
    marginTop: 10, backgroundColor: colors.primary,
    paddingVertical: 8, paddingHorizontal: 30,
    borderRadius: 8, alignItems: 'center'
  },
  bookButtonText: { color: colors.bodybackground, fontWeight: 'bold', fontSize: 14 }
});

export default Services;
