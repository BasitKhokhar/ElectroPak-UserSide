import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Loader from '../Loader/Loader';
import Constants from 'expo-constants';
import { colors } from "../../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('User not logged in');

      const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart items');

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCartItems();
    setRefreshing(false);
  };

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const handleRemoveFromCart = async (cartId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${API_BASE_URL}/cart/${userId}/${cartId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      setCartItems(cartItems.filter((item) => item.cart_id !== cartId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleQuantityChange = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity, user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      setCartItems(prev =>
        prev.map(item =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (isLoading)
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Your Cart</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              refreshing={refreshing}
              onRefresh={handleRefresh}
              data={cartItems}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.cart_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.productDetails}>
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                    <View>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemPrice}>Price: {item.price} </Text>
                      <Text style={styles.itemTotal}>Total: {item.price * item.quantity} </Text>
                    </View>
                  </View>

                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                      style={styles.qtyButton}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                      style={styles.qtyButton}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleRemoveFromCart(item.cart_id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        <Text style={styles.totalAmount}>Total: {totalAmount} Rupees</Text>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout', { cartItems, totalAmount })}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: colors.bodybackground,
    paddingTop: 30,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.cardsbackground,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardsbackground,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.text,
  },
  listContainer: {
    flex: 1,
    maxHeight: 400,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.cardsbackground,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  productDetails: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 10,
    marginRight: 10,
  },
  itemName: {
    fontWeight: 'bold',
    color: colors.text,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.mutedText,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "green",
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  qtyButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: colors.text,
  },
  removeButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  removeButtonText: {
    color: colors.cardsbackground,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 10,
    color: colors.text,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  checkoutText: {
    color: colors.cardsbackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    color: colors.text,
  },
});

export default CartScreen;
