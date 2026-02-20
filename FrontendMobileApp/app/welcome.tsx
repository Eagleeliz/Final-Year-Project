// app/welcome.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  // Add these functions to fix TypeScript errors

    const OnboardingScreen = () => {
    // @ts-ignore - Temporarily ignore TypeScript error
    router.push("/OnboardingScreen");
  };


  const goToLogin = () => {
    // @ts-ignore - Temporarily ignore TypeScript error
    router.push("/login");
  };

  const goToRegister = () => {
    // @ts-ignore - Temporarily ignore TypeScript error  
    router.push("/register");
  };


  return (
    <View style={styles.container}>
      {/* Header with app name and tagline */}
      <View style={styles.header}>
        <Text style={styles.appName}>MaternalCare</Text>
        <Text style={styles.tagline}>Your Pregnancy Companion</Text>
      </View>

      {/* Main illustration - using emoji as placeholder */}
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>🤰</Text>
      </View>

      {/* App description */}
      <View style={styles.descriptionBox}>
        <Text style={styles.description}>
          Track your pregnancy journey, monitor health, and get personalized 
          care tips—all in one place.
        </Text>
      </View>

      {/* Main CTA Button */}
      <Pressable
        style={styles.primaryButton}
         onPress={goToLogin}
      >
        <Text style={styles.buttonText}>Begin Your Journey</Text>
      </Pressable>

      {/* Secondary option */}
      <Pressable
        style={styles.secondaryButton}
        onPress={goToRegister} 
      >
        <Text style={styles.secondaryButtonText}>Create Account</Text>
      </Pressable>

      {/* Footer note */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text 
          style={styles.linkText}
          onPress={goToLogin}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF", // White background
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1E88E5", // Primary blue
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#424242", // Dark gray
  },
  imageContainer: {
    backgroundColor: "#E3F2FD", // Light blue background
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
  },
  descriptionBox: {
    backgroundColor: "#F5F5F5", // Light gray
    padding: 20,
    borderRadius: 12,
    marginBottom: 40,
    width: "100%",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#424242", // Dark gray
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: "#1E88E5", // Primary blue
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E88E5", // Blue border
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: "#1E88E5", // Blue text
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    color: "#757575", // Medium gray
    fontSize: 14,
  },
  linkText: {
    color: "#1E88E5", // Blue link
    fontWeight: "600",
  },
});