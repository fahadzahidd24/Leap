import React from "react";
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
import * as WebBrowser from "expo-web-browser";

const BRAND_RED = "#a5003c";
const TEXT_DARK = "#111827";
const TEXT_MUTED = "rgba(255,255,255,0.9)";
const SECTION_LABEL = "#a3a3a3";
const PROMO_TEXT_MUTED = "rgba(255,255,255,0.92)";
const RECOMMENDED_CARDS = [
  {
    key: "advisor-development",
    title: "Advisors",
    subtitle: "Development",
    image: require("../../assets/onboarding/onboard3-1.png"),
    url: "https://gitsagroup.com/advisor-development-3/",
  },
  {
    key: "agency-leaders-development",
    title: "Agency Leaders",
    subtitle: "Development",
    image: require("../../assets/onboarding/onboard3-2.png"),
    url: "https://gitsagroup.com/agency-leaders-development/",
  },
  {
    key: "agency-executives-development",
    title: "Agency Executives",
    subtitle: "Development",
    image: require("../../assets/onboarding/onboard3-3.png"),
    url: "https://gitsagroup.com/agency-executive-development/",
  },
  {
    key: "agency-recruiting-series",
    title: "Agency Recruiting",
    subtitle: "Series",
    image: require("../../assets/onboarding/onboard3-4.png"),
    url: "https://gitsagroup.com/agency-recruiting-series/",
  },
];
const PROFESSIONAL_DESIGNATION_CARDS = [
  {
    key: "cifm",
    title: "Certified Insurance\nField Manager",
    subtitle: "CIFM",
    image: require("../../assets/onboarding/onboard4-1.png"),
    url: "https://gitsagroup.com/certified-insurance-field-manager/",
  },
  {
    key: "cwa",
    title: "Certified\nWealth Advisor",
    subtitle: "CWA",
    image: require("../../assets/onboarding/onboard4-2.png"),
    url: "https://gitsagroup.com/certified-wealth-advisor/",
  },
  {
    key: "chip",
    title: "Certified Health\nInsurance Planner",
    subtitle: "CHIP",
    image: require("../../assets/onboarding/onboard4-3.png"),
    url: "https://gitsagroup.com/certified-health-insurance-planner/",
  },
];

const Onboarding = ({ navigation }) => {
  const { height, width } = useWindowDimensions();
  const heroHeight = Math.max(420, height * 0.65);
  const designationCardWidth = Math.max(300, width * 0.9);

  const openExternalUrl = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: BRAND_RED,
        toolbarColor: "#ffffff",
        dismissButtonStyle: "done",
        readerMode: false,
        enableBarCollapsing: true,
      });
    } catch (error) {
      console.error("Unable to open onboarding link:", error);
    }
  };

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
          // blurRadius={1}
        >
          <View style={styles.overlay}>
            <Image
              source={require("../../assets/GITSAFULLWHITELOGO.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.copyBlock}>
              <Text style={styles.headline}>Find Your Program</Text>
              <TouchableOpacity
                style={styles.sublineRow}
                activeOpacity={0.85}
                onPress={() => openExternalUrl("https://gitsagroup.com")}
              >
                <Text style={styles.subline}>Discover Now</Text>
                <View style={styles.arrowWrap}>
                  <Text style={styles.arrow}>{"→"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            Welcome to the Agency Growth Operating System Platform!
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("signin")}
          >
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>AGENCY PERFORMANCE PLATFORM</Text>

          <TouchableOpacity
            activeOpacity={0.92}
            style={styles.promoCardTouch}
            onPress={() => openExternalUrl("https://app.gitsagroup.com/pricing")}
          >
            <ImageBackground
              source={require("../../assets/onboarding/onboard2.png")}
              style={styles.promoCard}
              imageStyle={styles.promoCardImage}
            >
              <View style={styles.promoOverlay}>
                <Text style={styles.promoTitle}>Activity Tracking App </Text>
                <View style={styles.promoCtaRow}>
                  <Text style={styles.promoSubtitle}>Get your free trial today</Text>
                  <Text style={styles.promoArrow}>{"→"}</Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionBlock, styles.recommendedSectionBlock]}>
          <Text style={styles.sectionLabel}>RECOMMENDED FOR YOU</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedRow}
          >
            {RECOMMENDED_CARDS.map((card, index) => (
              <TouchableOpacity
                key={card.key}
                activeOpacity={0.92}
                style={[
                  styles.recommendedCardTouch,
                  index === RECOMMENDED_CARDS.length - 1
                    ? styles.recommendedCardLast
                    : null,
                ]}
                onPress={() => openExternalUrl(card.url)}
              >
                <ImageBackground
                  source={card.image}
                  style={styles.recommendedCard}
                  imageStyle={styles.recommendedCardImage}
                >
                  <View style={styles.recommendedOverlay}>
                    <Text style={styles.recommendedTitle}>{card.title}</Text>
                    <Text style={styles.recommendedSubtitle}>{card.subtitle}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.sectionBlock, styles.designationSectionBlock]}>
          <Text style={styles.sectionLabel}>PROFESSIONAL DESIGNATIONS</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.designationRow}
          >
            {PROFESSIONAL_DESIGNATION_CARDS.map((card, index) => (
              <TouchableOpacity
                key={card.key}
                activeOpacity={0.92}
                style={[
                  styles.designationCardTouch,
                  index === PROFESSIONAL_DESIGNATION_CARDS.length - 1
                    ? styles.designationCardLast
                    : null,
                ]}
                onPress={() => openExternalUrl(card.url)}
              >
                <ImageBackground
                  source={card.image}
                  style={[styles.designationCard, { width: designationCardWidth }]}
                  imageStyle={styles.designationCardImage}
                >
                  <View style={styles.designationOverlay}>
                    <Text style={styles.designationTitle}>{card.title}</Text>
                    <Text style={styles.designationSubtitle}>{card.subtitle}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
  },
  hero: {
    justifyContent: "space-between",
  },
  heroImage: {
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: Platform.OS === "android" ? 54 : 62,
    paddingBottom: 26,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  logo: {
    width: 196,
    height: 52,
    alignSelf: "center",
    marginTop: 6,
  },
  copyBlock: {
    marginBottom: 8,
  },
  headline: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "800",
    color: "#ffffff",
  },
  sublineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  subline: {
    fontSize: 18,
    fontWeight: "500",
    color: TEXT_MUTED,
  },
  arrow: {
    fontSize: 28,
    lineHeight: 30,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 5,
  },
  arrowWrap: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeCard: {
    marginTop: 0,
    marginBottom: 26,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: "#fff8f8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionBlock: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  designationSectionBlock: {
    marginTop: 34,
  },
  recommendedSectionBlock: {
    marginTop: 34,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: SECTION_LABEL,
    marginLeft: 8,
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  promoCardTouch: {
    borderRadius: 22,
  },
  promoCard: {
    minHeight: 250,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 22,
  },
  promoCardImage: {
    borderRadius: 22,
    resizeMode: "cover",
  },
  promoOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingBottom: 18,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  promoTitle: {
    maxWidth: "82%",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  promoSubtitle: {
    maxWidth: "82%",
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    color: PROMO_TEXT_MUTED,
    fontWeight: "500",
  },
  promoCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 4,
  },
  promoArrow: {
    marginLeft: 10,
    fontSize: 26,
    color: "#ffffff",
    fontWeight: "500",
    marginTop: 5,
  },
  recommendedRow: {
    paddingRight: 4,
  },
  recommendedCardTouch: {
    borderRadius: 22,
    marginRight: 14,
  },
  recommendedCardLast: {
    marginRight: 0,
  },
  recommendedCard: {
    width: 286,
    minHeight: 360,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 22,
  },
  recommendedCardImage: {
    borderRadius: 22,
    resizeMode: "cover",
  },
  recommendedOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  recommendedTitle: {
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "800",
    color: "#ffffff",
  },
  recommendedSubtitle: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 20,
    color: PROMO_TEXT_MUTED,
    fontWeight: "500",
  },
  designationCardTouch: {
    borderRadius: 22,
    marginRight: 14,
  },
  designationCardLast: {
    marginRight: 0,
  },
  designationRow: {
    paddingRight: 4,
  },
  designationCard: {
    minHeight: 300,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderRadius: 22,
  },
  designationCardImage: {
    borderRadius: 22,
    resizeMode: "cover",
  },
  designationOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 18,
    paddingBottom: 26,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  designationTitle: {
    maxWidth: "82%",
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  designationSubtitle: {
    maxWidth: "82%",
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    color: PROMO_TEXT_MUTED,
    fontWeight: "500",
  },
  welcomeText: {
    flex: 1,
    marginRight: 16,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: TEXT_DARK,
  },
  loginButton: {
    minWidth: 108,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: BRAND_RED,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default Onboarding;
