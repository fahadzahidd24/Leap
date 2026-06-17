import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NeedHelpModal from "../components/NeedHelpModal";

const NAVY = "#1e3a5f";
const TEXT_DARK = "#0f172a";
const TEXT_MUTED = "#64748b";
const ORANGE = "#f7a11f";
const PANEL_BORDER = "rgba(15, 23, 42, 0.08)";

const PRODUCTS = [
  {
    key: "leap",
    label: "Sales Activity\nManagement (SAM)",
    button: "Enter LEAP",
    icon: require("../../assets/logo.png"),
  },
  {
    key: "quest",
    label: "Recruitment Activity\nManagement (RAM)",
    button: "Enter QUEST",
    icon: require("../../assets/quest-logo-square.png"),
  },
];

const Onboarding = ({ navigation }) => {
  const { height } = useWindowDimensions();
  const heroHeight = Math.max(480, height * 0.6);
  const [helpVisible, setHelpVisible] = useState(false);

  const goToSignIn = () => navigation.navigate("signin");

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ImageBackground
          source={require("../../assets/onboarding/onboard1.png")}
          style={[styles.hero, { minHeight: heroHeight }]}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Image
              source={require("../../assets/GITSAFULLWHITELOGO.png")}
              style={styles.heroLogo}
              resizeMode="contain"
            />

            <View style={styles.taglineWrap}>
              <Text style={styles.tagline}>ONE APP. ONE SYSTEM.</Text>
              <Text style={styles.tagline}>INFINITE IMPACT.</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.bottomCard}>
          <View style={styles.brandHeader}>
            <View style={styles.brandLeft}>
              <Image
                source={require("../../assets/gitsaLogo.png")}
                style={styles.brandIcon}
                resizeMode="contain"
              />
              <View style={styles.brandTextWrap}>
                <Text style={styles.brandTitle}>GITSA One</Text>
                <Text style={styles.brandSubtitle}>Execution Growth Platform</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>
            Access your tools. Explore our solutions. Grow your business.
          </Text>

          <View style={styles.myAppsHeader}>
            <Image
              source={require("../../assets/BoxesIcon.png")}
              style={styles.myAppsIcon}
              resizeMode="contain"
            />
            <View style={styles.myAppsTextWrap}>
              <Text style={styles.myAppsTitle}>My Apps</Text>
              <Text style={styles.myAppsSubtitle}>
                Access your subscribed GITSA tools and platforms.
              </Text>
            </View>
          </View>

          <View style={styles.productGrid}>
            {PRODUCTS.map((product, index) => (
              <View
                key={product.key}
                style={[
                  styles.productCard,
                  index === 0 ? styles.productCardLeft : styles.productCardRight,
                ]}
              >
                <Image
                  source={product.icon}
                  style={styles.productIcon}
                  resizeMode="cover"
                />
                <View style={styles.productBody}>
                  <Text style={styles.productLabel}>{product.label}</Text>
                  <TouchableOpacity
                    style={styles.enterButton}
                    activeOpacity={0.88}
                    onPress={goToSignIn}
                  >
                    <Text style={styles.enterButtonText}>{product.button}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.helpCard}
            activeOpacity={0.85}
            onPress={() => setHelpVisible(true)}
          >
            <View style={styles.helpIcon}>
              <Ionicons name="headset-outline" size={22} color={NAVY} />
            </View>
            <View style={styles.helpTextWrap}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpSubtitle}>
                Contact the GITSA Support Team and we'll be happy to assist you.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={ORANGE} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <NeedHelpModal
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        mode="guest"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    paddingBottom: 28,
    backgroundColor: "#ffffff",
  },
  hero: {
    justifyContent: "space-between",
  },
  heroImage: {
    resizeMode: "cover",
  },
  heroOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 54 : 62,
    paddingBottom: 36,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  heroLogo: {
    width: 220,
    height: 66,
    alignSelf: "center",
    marginTop: 4,
  },
  taglineWrap: {
    alignItems: "center",
    marginBottom: 6,
  },
  tagline: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.4,
  },
  bottomCard: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  brandHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 10,
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: NAVY,
  },
  brandSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: TEXT_DARK,
    marginTop: 14,
  },
  myAppsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 14,
  },
  myAppsIcon: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
  myAppsTextWrap: {
    flex: 1,
  },
  myAppsTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY,
  },
  myAppsSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  productGrid: {
    flexDirection: "row",
  },
  productCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: PANEL_BORDER,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  productCardLeft: {
    marginRight: 6,
  },
  productCardRight: {
    marginLeft: 6,
  },
  productIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 8,
  },
  productBody: {
    flex: 1,
  },
  productLabel: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "700",
    color: TEXT_DARK,
  },
  enterButton: {
    marginTop: 8,
    backgroundColor: NAVY,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  enterButtonText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: PANEL_BORDER,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  helpIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#eef2f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  helpTextWrap: {
    flex: 1,
    marginRight: 8,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: NAVY,
  },
  helpSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
});

export default Onboarding;
