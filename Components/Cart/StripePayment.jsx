import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Image
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import valid from "card-validator";
import Paymentcardimages from "./paymentcardsimages";
import Constants from 'expo-constants';
import { colors } from "../../Themes/colors";   // <-- USING YOUR THEME

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const StripePayment = ({ route }) => {
  const { advance_payment, user_email } = route.params || {};
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [cardType, setCardType] = useState(null);

  const cardIcons = {
    visa: { uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" },
    mastercard: { uri: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
    "american-express": { uri: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" },
    discover: { uri: "https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg" },
  };

  const detectCardType = (number) => {
    const cardInfo = valid.number(number.replace(/\s/g, ""));
    if (cardInfo.card) setCardType(cardInfo.card.type);
    else setCardType(null);
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    if (formatted.length > 19) formatted = formatted.slice(0, 19);
    setCardNumber(formatted);
    detectCardType(formatted);
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 4) return;
    let formatted = cleaned.replace(/(\d{2})(\d{1,2})/, "$1/$2");

    setExpiry(formatted);
  };

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: advance_payment,
          currency: "usd",
          customerEmail: user_email,
        }),
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);

      Alert.alert("Success", "Payment initialized!");
    } catch (error) {
      Alert.alert("Error", "Failed to create payment intent");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiry || !cvc || !zip) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    const paymentIntentClientSecret = clientSecret || (await createPaymentIntent());
    if (!paymentIntentClientSecret) return;

    const { error } = await initPaymentSheet({ paymentIntentClientSecret });

    if (!error) {
      const { error: paymentError } = await presentPaymentSheet();
      if (paymentError) {
        Alert.alert("Payment Failed", paymentError.message);
      } else {
        Alert.alert("Success", `Payment of $${advance_payment} completed!`);
      }
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Enter Card Details</Text>

      {/* Form Card */}
      <View style={styles.formCard}>

        {/* CARD NUMBER */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>

          <View style={styles.cardInputWrapper}>
            <TextInput
              style={styles.cardInput}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={formatCardNumber}
            />

            <View style={styles.cardIconWrapper}>
              {cardType && cardIcons[cardType] && (
                <Image source={cardIcons[cardType]} style={styles.cardIcon} resizeMode="contain" />
              )}
            </View>
          </View>

          <Paymentcardimages />
        </View>

        {/* ROW : EXPIRY + CVC */}
        <View style={styles.row}>
          <View style={styles.inputContainerSmall}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              maxLength={5}
              value={expiry}
              onChangeText={formatExpiry}
            />
          </View>

          <View style={styles.inputContainerSmall}>
            <Text style={styles.label}>CVC</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor={colors.mutedText}
              keyboardType="numeric"
              maxLength={3}
              value={cvc}
              onChangeText={setCvc}
            />
          </View>
        </View>

        {/* ZIP CODE */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ZIP Code</Text>
          <TextInput
            style={styles.input}
            placeholder="12345"
            placeholderTextColor={colors.mutedText}
            keyboardType="numeric"
            maxLength={5}
            value={zip}
            onChangeText={setZip}
          />
        </View>
      </View>

      {/* BUTTON */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay: {advance_payment}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bodybackground,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.text,
    marginBottom: 15,
  },

  formCard: {
    backgroundColor: colors.cardsbackground,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  inputContainer: {
    marginBottom: 15,
  },

  inputContainerSmall: {
    width: "48%",
  },

  label: {
    fontSize: 15,
    color: colors.mutedText,
    marginBottom: 5,
  },

  input: {
    backgroundColor: colors.cardsbackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontSize: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardsbackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },

  cardInput: {
    width: "60%",
    fontSize: 16,
    padding: 12,
    color: colors.text,
  },

  cardIconWrapper: {
    width: "30%",
    alignItems: "flex-end",
  },

  cardIcon: {
    width: 40,
    height: 25,
  },

  payButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default StripePayment;
