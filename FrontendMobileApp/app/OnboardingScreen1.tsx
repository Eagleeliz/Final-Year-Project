import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const OnboardingScreen1 = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* Top Illustration Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/onboarding1.jpg")} // Replace with your image path
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Text Content Section */}
      <View style={styles.textContainer}>
        {/* Main Title */}
        <Text style={styles.title}>
          Beginning Your{"\n"}Pregnancy Journey
        </Text>

        {/* Subtitle / Description */}
        <Text style={styles.description}>
          Welcome! Let’s begin your journey together with support, guidance, and
          care throughout your pregnancy.
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Onboarding2")}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDECEF", // Soft pink background
    justifyContent: "space-between",
    paddingVertical: 40,
  },

  /* Image Styling */
  imageContainer: {
    flex: 0.55,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "85%",
    height: "100%",
  },

  /* Text Styling */
  textContainer: {
    flex: 0.25,
    alignItems: "center",
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D94C72",
    textAlign: "center",
    marginBottom: 15,
  },

  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    lineHeight: 22,
  },

  /* Button Styling */
  buttonContainer: {
    flex: 0.15,
    alignItems: "center",
  },

  button: {
    backgroundColor: "#F76C8A",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});