// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import ProductModal from "./ProductModal";
// import Constants from 'expo-constants';
// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || "";

// const Completesets = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/complete_acessory_sets`);
//         const data = await res.json();
//         setProducts(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchUserId = async () => {
//       try {
//         const storedUserId = await AsyncStorage.getItem("userId");
//         if (storedUserId) setUserId(storedUserId);
//       } catch (error) {
//         console.error("Error fetching userId:", error);
//       }
//     };
//     fetchUserId();
//   }, []);

//   const openProductModal = (product) => {
//     const formattedProduct = {
//       id: product.id,
//       name: product.name || "Unnamed",
//       price: product.price || "N/A",
//       image_url: product.image_url || "",
//       stock: product.stock || "N/A",
//       subcategory_id: product.subcategory_id,
//       created_at: product.created_at,
//       updated_at: product.updated_at,
//     };
//     setSelectedProduct(formattedProduct);
//   };

//   const closeProductModal = () => setSelectedProduct(null);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Complete Accessory Sets</Text>
//       <FlatList
//         data={products}
//         keyExtractor={(item, index) => (item?.id ? item.id.toString() : `key-${index}`)}
//         numColumns={2}
//         columnWrapperStyle={styles.columnWrapper}
//         renderItem={({ item, index }) => (
//           <View style={[styles.productCard, index % 2 === 0 ? styles.offsetCard : {}]}>
//             <Image
//               source={{ uri: item.image_url || "https://via.placeholder.com/100" }}
//               style={styles.productImage}
//               resizeMode="cover"
//               onError={(e) => console.warn("Image load error:", e.nativeEvent?.error)}
//             />
//             <Text style={styles.productName}>{item.name || "Unnamed"}</Text>
//             <Text style={styles.productStock}>Stock: {item.stock || "N/A"}</Text>
//             <Text style={styles.newProductPrice}>Now: {item.price || "N/A"}</Text>
//             <TouchableOpacity style={styles.shopNowButton} onPress={() => openProductModal(item)}>
//               <Text style={styles.shopNowText}>Shop Now</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       {selectedProduct && (
//         <ProductModal
//           product={selectedProduct}
//           onClose={closeProductModal}
//           userId={userId}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loader: { marginTop: 50 },
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 35,
//     textAlign: "center",
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//   },
//   productCard: {
//     width: "48%",
//     padding: 12,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 15,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   offsetCard: {
//     marginTop: 20, // Staggered layout
//   },
//   productImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 5,
//     borderWidth: 2,
//     borderColor: 'black',
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 5,
//     textAlign: "center",
//     color: "#333",
//   },
//   productStock: {
//     fontSize: 12,
//     color: "#666",
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#888",
//     textDecorationLine: "line-through",
//   },
//   newProductPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#E44D26",
//   },
//   shopNowButton: {
//     marginTop: 8,
//     backgroundColor: "black",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 5,
//   },
//   shopNowText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });

// export default Completesets;
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
import ProductModal from "./ProductModal";

const Completesets = ({ sets }) => {
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };
    fetchUserId();
  }, []);

  const openProductModal = (product) => {
    const formattedProduct = {
      id: product.id,
      name: product.name || "Unnamed",
      price: product.price || "N/A",
      image_url: product.image_url || "",
      stock: product.stock || "N/A",
      subcategory_id: product.subcategory_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
    setSelectedProduct(formattedProduct);
  };

  const closeProductModal = () => setSelectedProduct(null);

  if (!Array.isArray(sets) || sets.length === 0) {
    return (
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <Text style={{ fontSize: 16, color: "gray" }}>No complete sets available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complete Accessory Sets</Text>
      <FlatList
        data={sets}
        keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item, index }) => (
          <View style={[styles.productCard, index % 2 === 0 ? styles.offsetCard : {}]}>
            <Image
              source={{ uri: item.image_url || "https://via.placeholder.com/100" }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(e) => console.warn("Image load error:", e.nativeEvent?.error)}
            />
            <Text style={styles.productName}>{item.name || "Unnamed"}</Text>
            <Text style={styles.productStock}>Stock: {item.stock || "N/A"}</Text>
            <Text style={styles.newProductPrice}>Now: {item.price || "N/A"}</Text>
            <TouchableOpacity style={styles.shopNowButton} onPress={() => openProductModal(item)}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={closeProductModal}
          userId={userId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 35,
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  offsetCard: {
    marginTop: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
    color: "#333",
  },
  productStock: {
    fontSize: 12,
    color: "#666",
  },
  newProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E44D26",
  },
  shopNowButton: {
    marginTop: 8,
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  shopNowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Completesets;
