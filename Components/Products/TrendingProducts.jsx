// import React, { useEffect, useState, useRef } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Animated,
//   Dimensions,
//   PanResponder,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Constants from "expo-constants";
// import ProductModal from "./ProductModal";
// import { LinearGradient } from "expo-linear-gradient";

// const API_BASE_URL = Constants.expoConfig?.extra?.API_BASE_URL || "";
// const SCREEN_WIDTH = Dimensions.get("window").width;
// const SCREEN_HEIGHT = Dimensions.get("window").height;

// const TrendingProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [userId, setUserId] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const position = useRef(new Animated.ValueXY()).current;

//   const gradients = [
//     ["#1A1A1A", "#4B4B4B", "#696969"],
//     ["#8A2BE2", "#9370DB", "#BA55D3"],
//     ["#0000FF", "#4169E1", "#00BFFF"],
//     ["#87CEEB", "#4682B4", "#1E90FF"],
//     ["#00CED1", "#20B2AA", "#40E0D0"],
//     ["#008000", "#32CD32", "#00FA9A"],
//     ["#2F4F4F", "#556B2F", "#6B8E23"],
//     ["#FFD700", "#FFA500", "#FF8C00"],
//     ["#FF4500", "#FF6347", "#FF7F50"],
//     ["#A52A2A", "#B22222", "#DC143C"],
//   ];

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProducts = async () => {
//       try {
//         const res = await fetch(`${API_BASE_URL}/trending_products`);
//         const data = await res.json();

//         if (Array.isArray(data)) {
//           const withGradients = data
//             .filter(item => item?.id && item?.image_url && item?.name) // minimal safe check
//             .map((product, index) => ({
//               ...product,
//               gradient: gradients[index % gradients.length],
//             }));
//           if (isMounted) setProducts(withGradients);
//         }
//       } catch (err) {
//         console.error("Failed to fetch products", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     const loadUserId = async () => {
//       try {
//         const id = await AsyncStorage.getItem("userId");
//         if (isMounted) setUserId(id);
//       } catch (err) {
//         console.error("Error loading user ID:", err);
//       }
//     };

//     fetchProducts();
//     loadUserId();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gesture) => {
//         try {
//           position.setValue({ x: gesture.dx, y: gesture.dy });
//         } catch (e) {
//           console.error("Gesture error:", e);
//         }
//       },
//       onPanResponderRelease: (_, gesture) => {
//         if (Math.abs(gesture.dx) > 120) {
//           Animated.timing(position, {
//             toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
//             duration: 250,
//             useNativeDriver: false,
//           }).start(() => {
//             position.setValue({ x: 0, y: 0 });
//             setProducts(prev => {
//               const updated = [...prev];
//               const first = updated.shift();
//               updated.push(first);
//               return updated;
//             });
//           });
//         } else {
//           Animated.spring(position, {
//             toValue: { x: 0, y: 0 },
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//   ).current;

//   const openProductModal = (product) => setSelectedProduct(product);
//   const closeProductModal = () => setSelectedProduct(null);

//   if (loading) {
//     return <ActivityIndicator size="large" style={styles.loader} />;
//   }

//   return (
//     <View style={styles.container}>
//       {products.map((item, index) => {
//         const isTopCard = index === 0;
//         const animatedStyle = isTopCard
//           ? {
//               transform: [
//                 {
//                   rotate: position.x.interpolate({
//                     inputRange: [-200, 0, 200],
//                     outputRange: ["-10deg", "0deg", "10deg"],
//                   }),
//                 },
//                 ...position.getTranslateTransform(),
//               ],
//             }
//           : {
//               top: index * 5,
//               zIndex: -index,
//             };

//         return (
//           <Animated.View
//             key={item.id?.toString() || `${index}`}
//             {...(isTopCard ? panResponder.panHandlers : {})}
//             style={[styles.card, animatedStyle]}
//           >
//             <LinearGradient colors={item.gradient} style={styles.cardBackground}>
//               <View style={styles.imageContainer}>
//                 <Image
//                   source={{ uri: item.image_url }}
//                   style={styles.image}
//                   onError={() => console.warn("Image failed to load for:", item.name)}
//                 />
//               </View>
//               <View style={styles.cardInfo}>
//                 <Text style={styles.name}>{item.name}</Text>
//                 <Text style={styles.stock}>Stock: {item.stock}</Text>
//                 <Text style={styles.price}>Price: {item.price}</Text>
//                 <TouchableOpacity style={styles.button} onPress={() => openProductModal(item)}>
//                   <Text style={styles.buttonText}>Shop Now</Text>
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </Animated.View>
//         );
//       })}
//       {selectedProduct && (
//         <ProductModal product={selectedProduct} onClose={closeProductModal} userId={userId} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   loader: { marginTop: 50 },
//   container: {
//     width: "100%",
//     height: "100%",
//     marginTop: 20,
//     marginBottom: 100,
//     marginTop:50,
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingTop: 150, 
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "black",
//   },
//   card: {
//     position: "absolute",
//     width: SCREEN_WIDTH * 0.87,
//     height: SCREEN_HEIGHT * 0.25,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   cardBackground: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 10,
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   imageContainer: {
//     width: "60%",
//     height: "80%",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//     borderWidth: 2,
//     borderColor: "white",
//     borderRadius: 10,
//     resizeMode: "stretch",
//   },
//   cardInfo: {
//     display: "flex",
//     flexDirection: "column",
//     paddingHorizontal: 15,
//   },
//   name: { fontSize: 14, fontWeight: "bold", color: "white" },
//   stock: { fontSize: 14, fontWeight: "bold", color: "white" },
//   price: { fontSize: 16, fontWeight: "bold", color: "white" },
//   button: {
//     marginTop: 10,
//     backgroundColor: "#1A1A1A",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderWidth: 2,
//     borderColor: "white",
//     borderRadius: 5,
//   },
//   buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
// });

// export default TrendingProducts;
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductModal from "./ProductModal";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const gradients = [
  ["#1A1A1A", "#4B4B4B", "#696969"],
  ["#8A2BE2", "#9370DB", "#BA55D3"],
  ["#0000FF", "#4169E1", "#00BFFF"],
  ["#87CEEB", "#4682B4", "#1E90FF"],
  ["#00CED1", "#20B2AA", "#40E0D0"],
  ["#008000", "#32CD32", "#00FA9A"],
  ["#2F4F4F", "#556B2F", "#6B8E23"],
  ["#FFD700", "#FFA500", "#FF8C00"],
  ["#FF4500", "#FF6347", "#FF7F50"],
  ["#A52A2A", "#B22222", "#DC143C"],
];

const TrendingProducts = ({ products }) => {
  const [userId, setUserId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const position = useRef(new Animated.ValueXY()).current;
  const [cardProducts, setCardProducts] = useState([]);

  useEffect(() => {
    if (Array.isArray(products)) {
      const prepared = products.map((p, i) => ({
        ...p,
        gradient: gradients[i % gradients.length],
      }));
      setCardProducts(prepared);
    }
  }, [products]);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) setUserId(id);
    };
    fetchUserId();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          Animated.timing(position, {
            toValue: { x: gesture.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setCardProducts((prev) => {
              const updated = [...prev];
              const first = updated.shift();
              updated.push(first);
              return updated;
            });
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const openProductModal = (product) => setSelectedProduct(product);
  const closeProductModal = () => setSelectedProduct(null);

  if (!cardProducts.length) {
    return (
      <View style={{ alignItems: "center", marginVertical: 40 }}>
        <Text style={{ fontSize: 16, color: "gray" }}>No trending products</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cardProducts.map((item, index) => {
        const isTopCard = index === 0;
        const animatedStyle = isTopCard
          ? {
              transform: [
                {
                  rotate: position.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ["-10deg", "0deg", "10deg"],
                  }),
                },
                ...position.getTranslateTransform(),
              ],
            }
          : {
              top: index * 5,
              zIndex: -index,
            };

        return (
          <Animated.View
            key={item.id?.toString() || index.toString()}
            {...(isTopCard ? panResponder.panHandlers : {})}
            style={[styles.card, animatedStyle]}
          >
            <LinearGradient colors={item.gradient} style={styles.cardBackground}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.image}
                  resizeMode="stretch"
                  onError={() => console.warn("Failed to load image:", item.name)}
                />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.stock}>Stock: {item.stock}</Text>
                <Text style={styles.price}>Price: {item.price}</Text>
                <TouchableOpacity style={styles.button} onPress={() => openProductModal(item)}>
                  <Text style={styles.buttonText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        );
      })}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeProductModal} userId={userId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 60,
    marginBottom: 130,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 120,
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.87,
    height: SCREEN_HEIGHT * 0.25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  imageContainer: {
    width: "55%",
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 15,
  },
  image: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  stock: { fontSize: 12, color: "#fff" },
  price: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  button: {
    marginTop: 10,
    backgroundColor: "#1A1A1A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TrendingProducts;
