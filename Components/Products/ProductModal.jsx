import React, { useState } from "react";
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Constants from "expo-constants";
import colors from "../../Themes/colors"; // ✅ USING THEME FILE

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const { width, height } = Dimensions.get("window");

const colorOptions = ["White", "Half White", "Chrome", "Light Pink", "Light Grey", "Burgundy"];

const ProductModal = ({ product, onClose, userId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const handleAddToCart = async () => {
    const productWithOptions = {
      ...product,
      selectedColor: selectedColor || "None",
      quantity: 1,
      user_id: userId,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithOptions),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmationMessage(data.message || "Product added to cart");
        setConfirmationVisible(true);

        setTimeout(() => {
          setConfirmationVisible(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Modal visible={true} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <FontAwesome name="times" size={24} color={colors.primary} />
            </TouchableOpacity>

            <Image source={{ uri: product.image_url }} style={styles.productImage} />

            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productStock}>Stock: {product.stock}</Text>
            <Text style={styles.productPrice}>Price: {product.price}</Text>

            {/* Color Selection */}
            {/* <View style={styles.colorSelector}>
              <Text style={styles.label}>Select Color:</Text>

              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorBox,
                      selectedColor === color && styles.selectedColorBox,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && { color: "#fff" },
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View> */}

            <TouchableOpacity
              onPress={handleAddToCart}
              style={[styles.cartButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal visible={confirmationVisible} transparent animationType="slide">
        <View style={styles.confirmationOverlay}>
          <View style={[styles.confirmationBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.confirmationText}>{confirmationMessage}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.75,
    backgroundColor: colors.cardsbackground,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  productImage: {
    width: width * 0.55,
    height: width * 0.42,
    borderRadius: 10,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: colors.border,
  },
  productName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: colors.text,
    marginVertical: 10,
    textAlign: "center",
  },
  productStock: {
    fontSize: width * 0.04,
    color: colors.mutedText,
    textAlign: "center",
  },
  productPrice: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  colorSelector: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  colorBox: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    margin: 5,
  },
  selectedColorBox: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  colorText: {
    color: colors.text,
    fontSize: width * 0.035,
  },
  cartButton: {
    width:'70%',
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmationOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  confirmationBox: {
    width: "90%",
    marginBottom: 40,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  confirmationText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductModal;
