import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../Loader/Loader";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import colors from "../../Themes/colors"; //  ← theme import

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const FAQ = () => {
  const navigation = useNavigation();
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: colors.bodybackground,
        padding: 20,
      }}
    >
      {/* <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Frequently Asked Questions
      </Text> */}

      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            borderRadius: 10,
            backgroundColor: colors.cardsbackground,
          }}
        >
          <Loader />
        </View>
      ) : (
        faqs.map((faq, index) => (
          <View
            key={faq.id}
            style={{
              marginBottom: 12,
              borderRadius: 10,
              overflow: "hidden",
              backgroundColor: colors.cardsbackground,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Question Box */}
            <TouchableOpacity
              onPress={() => toggleExpand(index)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 15,
                backgroundColor: colors.cardsbackground,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.text,
                  flex: 1,
                  paddingRight: 10,
                }}
              >
                {faq.question}
              </Text>

              <Ionicons
                name={
                  expandedIndex === index
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color={colors.text}
              />
            </TouchableOpacity>

            {/* Answer Box */}
            {expandedIndex === index && (
              <View
                style={{
                  backgroundColor: colors.secondary,
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.text,
                    lineHeight: 20,
                  }}
                >
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default FAQ;
