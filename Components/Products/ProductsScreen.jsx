import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";
import ProductModal from "./ProductModal";
import Loader from "../Loader/Loader";
import Constants from "expo-constants";
import colors from "../../Themes/colors";

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState("az");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Sort: A to Z", value: "az" },
    { label: "Sort: Z to A", value: "za" },
    { label: "Sort: Price Low to High", value: "priceLowHigh" },
    { label: "Sort: Price High to Low", value: "priceHighLow" },
  ]);

  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error retrieving user ID:", error);
      }
    };
    getUserId();
  }, []);

  const fetchProducts = () => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        let sortedData = [...data];
        if (sortOrder === "az") {
          sortedData.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === "za") {
          sortedData.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === "priceLowHigh") {
          sortedData.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "priceHighLow") {
          sortedData.sort((a, b) => b.price - a.price);
        }
        setProducts(sortedData);
        setFilteredProducts(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setRefreshing(false);
  };

  const openProductModal = (product) => setSelectedProduct(product);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productStock}>Stock: {item.stock}</Text>
      <Text style={styles.productPrice}>Price: {item.price}</Text>

      <TouchableOpacity
        onPress={() => openProductModal(item)}
        style={styles.shopNowButton}
      >
        <Text style={styles.shopNowText}>Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
  
      <View style={styles.container}>
        <Text style={styles.title}>All Products</Text>
        {/* <DropDownPicker
          open={open}
          value={sortOrder}
          items={items}
          setOpen={setOpen}
          setValue={setSortOrder}
          setItems={setItems}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          dropDownContainerStyle={styles.dropdownMenu}
          placeholder="Select Sorting Option"
        /> */}

        <FlatList
          data={filteredProducts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={7}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />

        {selectedProduct && (
          <ProductModal
            userId={userId}
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    paddingHorizontal:10,
    marginTop:15,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: colors.cardsbackground,
  },

  dropdownContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
    zIndex: 1000,
    width: "90%",
  },
  dropdown: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 10,
    borderColor: colors.border,
  },
  dropdownMenu: {
    backgroundColor: colors.cardsbackground,
    borderColor: colors.border,
    borderRadius: 10,
  },

  listContainer: {
    // paddingHorizontal: 15,
    marginTop: 10,
    paddingBottom: 10,
  },
 title:{
  fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 10,
      color: colors.text,paddingLeft:5
 },
  productCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: colors.cardsbackground,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },

  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },

  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
    color: colors.text,
  },

  productStock: {
    fontSize: 12,
    color: colors.mutedText,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },

  shopNowButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },

  shopNowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ProductsScreen;
