import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import Constants from 'expo-constants';
import { colors } from "../../Themes/colors"; // <-- using colors.js

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;
const { width } = Dimensions.get("window");

const Paymentcardimages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/images`);
                const data = await res.json();
                setImages(data || []);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return (
            <ActivityIndicator 
                size="large" 
                color={colors.secondary} 
                style={{ marginTop: 20 }} 
            />
        );
    }

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={{ padding: 10 }}
        >
            {images.map((item) => (
                <View key={item.id} style={{ marginRight: 10 }}>
                    <Image
                        source={{ uri: item.image_url }}
                        style={{
                            width: width / 8,
                            height: 35,
                            borderRadius: 5,
                            backgroundColor: colors.black,
                            borderWidth: 1,
                            borderColor: colors.lightGray,
                        }}
                        resizeMode="cover"
                    />
                </View>
            ))}
        </ScrollView>
    );
};

export default Paymentcardimages;
