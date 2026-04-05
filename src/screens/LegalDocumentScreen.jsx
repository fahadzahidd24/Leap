import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLegalDocument } from "../constants/legalDocuments";

const BRAND_BACKGROUND = "#cfe9f6";
const BRAND_ACCENT = "#e6634c";
const TEXT_PRIMARY = "#0f172a";
const TEXT_MUTED = "#64748b";

const LegalDocumentScreen = ({ navigation, route }) => {
  const document = getLegalDocument(route?.params?.documentKey);

  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={BRAND_BACKGROUND} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Legal</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.missingState}>
          <Text style={styles.missingTitle}>Document unavailable</Text>
          <Text style={styles.missingBody}>
            The requested legal document could not be loaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BRAND_BACKGROUND} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{document.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{document.title}</Text>
          <Text style={styles.updatedAt}>{document.updatedAt}</Text>

          {document.intro?.map((paragraph, index) => (
            <Text key={`intro-${index}`} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}

          {document.sections.map((section) => (
            <View key={section.heading} style={styles.section}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              {section.paragraphs.map((paragraph, index) => (
                <Text key={`${section.heading}-${index}`} style={styles.paragraph}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 22,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT_PRIMARY,
  },
  updatedAt: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: BRAND_ACCENT,
  },
  sourceNote: {
    marginTop: 4,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  section: {
    marginTop: 18,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: TEXT_PRIMARY,
    marginTop: 8,
  },
  missingState: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  missingTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_PRIMARY,
  },
  missingBody: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    color: TEXT_MUTED,
  },
});

export default LegalDocumentScreen;
