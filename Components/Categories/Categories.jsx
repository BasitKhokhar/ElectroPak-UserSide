// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Dimensions,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Constants from 'expo-constants';

// const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

// const screenWidth = Dimensions.get('window').width;
// const cardPadding = 20;
// const cardSpacing = 10;
// const cardWidth = screenWidth * 0.28;

// const Categories = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorImageIds, setErrorImageIds] = useState({});
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/categories`);
//         const data = await response.json();
//         if (Array.isArray(data)) {
//           setCategories(data);
//         } else {
//           console.warn("Invalid categories data format");
//           setCategories([]);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         setCategories([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const renderItem = ({ item }) => {
//     const imageFailed = errorImageIds[item.id];

//     return (
//       <TouchableOpacity
//         style={{ width: cardWidth, marginRight: cardSpacing }}
//         onPress={() => navigation.navigate('Subcategories', { categoryId: item.id })}
//       >
//         <View style={{
//           backgroundColor: '#ffffff',
//           padding: 10,
//           borderRadius: 10,
//           shadowColor: '#000',
//           shadowOffset: { width: 0, height: 2 },
//           shadowOpacity: 0.3,
//           shadowRadius: 4,
//           elevation: 5,
//         }}>
//           {!imageFailed ? (
//             <Image
//               source={{ uri: item.image_url }}
//               style={{ width: '100%', height: 90, borderRadius: 5 }}
//               resizeMode="cover"
//               onError={() =>
//                 setErrorImageIds(prev => ({ ...prev, [item.id]: true }))
//               }
//             />
//           ) : (
//             <View style={{
//               width: '100%',
//               height: 90,
//               borderRadius: 5,
//               backgroundColor: '#ccc',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}>
//               <Text style={{ fontSize: 12, color: '#444' }}>Image unavailable</Text>
//             </View>
//           )}
//         </View>

//         <Text style={{
//           fontSize: 14,
//           textAlign: 'center',
//           fontWeight: '500',
//           marginTop: 5,
//         }}>
//           {item.name}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   if (categories.length === 0) {
//     return (
//       <View style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>No categories found.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: '#F8F9FA', paddingVertical: 20 }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
//         Categories
//       </Text>

//       <FlatList
//         data={categories}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingHorizontal: cardPadding }}
//         renderItem={renderItem}
//       />
//     </View>
//   );
// };

// export default Categories;
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const cardPadding = 20;
const cardSpacing = 10;
const cardWidth = screenWidth * 0.28;

const Categories = ({ categoriesData }) => {
  const [errorImageIds, setErrorImageIds] = useState({});
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const imageFailed = errorImageIds[item.id];

    return (
      <TouchableOpacity
        style={{ width: cardWidth, marginRight: cardSpacing }}
        onPress={() =>
          navigation.navigate('Subcategories', { categoryId: item.id })
        }
      >
        <View
          style={{
            backgroundColor: '#ffffff',
            padding: 10,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          {!imageFailed ? (
            <Image
              source={{ uri: item.image_url }}
              style={{ width: '100%', height: 90, borderRadius: 5 }}
              resizeMode="cover"
              onError={() =>
                setErrorImageIds((prev) => ({ ...prev, [item.id]: true }))
              }
            />
          ) : (
            <View
              style={{
                width: '100%',
                height: 90,
                borderRadius: 5,
                backgroundColor: '#ccc',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, color: '#444' }}>
                Image unavailable
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            textAlign: 'center',
            fontWeight: '500',
            marginTop: 5,
          }}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (!categoriesData || categoriesData.length === 0) {
    return (
      <View
        style={{ height: 180, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text>No categories found.</Text>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: '#F8F9FA', paddingVertical: 10 }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        Categories
      </Text>

      <FlatList
        data={categoriesData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: cardPadding }}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Categories;
