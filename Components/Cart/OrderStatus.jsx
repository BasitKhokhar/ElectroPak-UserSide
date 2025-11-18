import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useFocusEffect } from "@react-navigation/native";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// Local asset image
const fixedImage = require("../../assets/order_notification.jpg"); // Adjust path as needed

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // 👉 Load User ID first
  useFocusEffect(
    useCallback(() => {
      const fetchUserId = async () => {
        const id = await AsyncStorage.getItem("userId");
        setUserId(id);
      };
      fetchUserId();
    }, [])
  );

  // 👉 Fetch orders when screen focuses AND userId exists
  useFocusEffect(
    useCallback(() => {
      if (!userId) return;

      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}`);
          const data = await response.json();
          console.log("Orders:", data);
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }, [userId])
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={fixedImage} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>Order By: {item.name}</Text>
       <Text>Total Amount: Rs {Number(item.total_amount).toLocaleString("en-PK", { maximumFractionDigits: 0 })}</Text>

        <Text>Ordered On: {new Date(item.created_at).toLocaleDateString()}</Text>
        <Text style={styles.status}>Status: "{item.status}"</Text>
      </View>
    </View>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default OrdersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 100,
  },
  textContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    marginTop: 5,
    color: "#007bff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
