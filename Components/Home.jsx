import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,Image
} from "react-native";
import OnSaleProducts from "./Products/OnSaleProducts";
import Completesets from "./Products/Completesets";
import TrendingProducts from "./Products/TrendingProducts";
import ShopLocation from "./Services/ShopLocation";
import Categories from "./Categories/Categories";
import ProductsScreen from "./Products/ProductsScreen";
import ImageSlider from "./Sliders/Slider";
import UserNameDisplay from "./User/UserNameDisplay";
import BrandSlider from "./Sliders/BrandSlider";
import CustomerSupportoptions from "./User/CustomerSupportoptions";
import Loader from "./Loader/Loader";
import Constants from "expo-constants";
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [homeData, setHomeData] = useState({
    sliderData: [],
    categoryData: [],
    brandData: [],
    onSaleProducts: [],
    trendingProducts: [],
    completeSets: [],
    firstColumnData: [],
    secondColumnData: [],
  });

  useEffect(() => {
    if (navigation) {
      navigation.setOptions({ headerShown: false });
    }
  }, []);

  const fetchData = async () => {
      try {
        const endpoints = [
          { key: "sliderData", url: `${API_BASE_URL}/sliderimages` },
          { key: "categoryData", url: `${API_BASE_URL}/categories` },
          { key: "onSaleProducts", url: `${API_BASE_URL}/onsale_products` },
          { key: "brandData", url: `${API_BASE_URL}/brands` },
          { key: "trendingProducts", url: `${API_BASE_URL}/trending_products` },
          { key: "completeSets", url: `${API_BASE_URL}/complete_acessory_sets` },
          { key: "firstColumnData", url: `${API_BASE_URL}/first_column_data` },
          { key: "secondColumnData", url: `${API_BASE_URL}/second_column_data` },
        ];

        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            fetch(endpoint.url)
              .then((res) => res.json())
              .then((data) => ({ key: endpoint.key, data }))
              .catch(() => ({ key: endpoint.key, data: [] }))
          )
        );

        const updated = responses.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});

        setHomeData(updated);
      } catch (error) {
        console.error("Home data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY <= 0) {
      handleRefresh();
    }
  };
  console.log("homedata", homeData.completeSets)
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  const sections = [
    { key: "user", render: () => <UserNameDisplay /> },
    { key: "slider", render: () => <ImageSlider sliderData={homeData.sliderData} /> },
    { key: "allproducts", render: () => <ProductsScreen /> },
      {
      key: "midImage",
      render: () => (
        <View style={{ marginVertical: 15 }}>
          <Image
            source={require("../assets/location.jpeg")}
            style={styles.middleImage}
          />
        </View>
      ),
    },
    // { key: "categories", render: () => <Categories categoriesData={homeData.categoryData} /> },
    // { key: "onSale", render: () => <OnSaleProducts products={homeData.onSaleProducts} /> },
    // { key: "brands", render: () => <BrandSlider brands={homeData.brandData} /> },
    // {
    //   key: "trending",
    //   render: () => (
    //     <>
    //       <Text style={styles.sectionTitle}>Trending Products</Text>
    //       <TrendingProducts products={homeData.trendingProducts} />
    //     </>
    //   ),
    // },
    // {
    //   key: "completeSets",
    //   render: () => <Completesets sets={homeData.completeSets} />,
    // },
    // { key: "location", render: () => <ShopLocation /> },
    {
      key: "support",
      render: () => (
        <CustomerSupportoptions
          firstColumnData={homeData.firstColumnData}
          secondColumnData={homeData.secondColumnData}
        />
      ),
    },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => <View>{item.render()}</View>}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      initialNumToRender={2} 
      windowSize={5} 
      maxToRenderPerBatch={3} 
      updateCellsBatchingPeriod={100} 

      onScroll={handleScroll}
      scrollEventThrottle={16} 
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 120,
    backgroundColor: "#F8F9FA",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
   middleImage: {
    width: "92%",
    height: 350,
    alignSelf: "center",
    borderRadius: 12,
    resizeMode: "cover",
  },
});

export default HomeScreen;
