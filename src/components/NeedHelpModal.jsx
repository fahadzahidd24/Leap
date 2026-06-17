import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { publicApi, privateSharedApi } from "../api/axios";

const NAVY = "#1e3a5f";
const TEXT_DARK = "#0f172a";
const TEXT_MUTED = "#64748b";
const BORDER = "#e2e8f0";
const DANGER = "#ef4444";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reusable "Need Help?" form modal.
 *
 * mode="guest"  → logged-out (onboarding). Collects name + email + message.
 *                 Submits to the public endpoint.
 * mode="authed" → logged-in (in-app drawer). Collects subject + message only;
 *                 the server attaches the user's identity. Submits with the
 *                 current module so the request is tagged leap/quest.
 */
const NeedHelpModal = ({ visible, onClose, mode = "guest", moduleKey }) => {
  const isGuest = mode === "guest";

  const user = useSelector((state) => state.User);
  const selectedModule = useSelector((state) => state.Module?.selectedModule);
  const resolvedModule = moduleKey || selectedModule || "LEAP";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    resetForm();
    onClose?.();
  };

  const validate = () => {
    const next = {};
    if (isGuest) {
      if (!name.trim()) next.name = "Please enter your name.";
      if (!email.trim() || !EMAIL_REGEX.test(email.trim()))
        next.email = "Please enter a valid email.";
    }
    if (!message.trim()) next.message = "Please describe how we can help.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isGuest) {
        await publicApi.post("/public/support", {
          source: "onboarding",
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        });
      } else {
        await privateSharedApi(user?.token).post("/support", {
          module: resolvedModule,
          subject: subject.trim(),
          message: message.trim(),
        });
      }

      resetForm();
      onClose?.();
      Alert.alert(
        "Request sent",
        "Thanks for reaching out. The GITSA Support Team will get back to you soon."
      );
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Couldn't send request", apiMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.sheetWrap}
            >
              <View style={styles.sheet}>
                <View style={styles.header}>
                  <View style={styles.headerIcon}>
                    <Ionicons name="headset-outline" size={20} color={NAVY} />
                  </View>
                  <View style={styles.headerTextWrap}>
                    <Text style={styles.title}>Need help?</Text>
                    <Text style={styles.subtitle}>
                      Contact the GITSA Support Team and we'll be happy to
                      assist you.
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={22} color={TEXT_MUTED} />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.scroll}
                  contentContainerStyle={styles.scrollContent}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {isGuest && (
                    <>
                      <Field
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Your full name"
                        error={errors.name}
                      />
                      <Field
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                      />
                    </>
                  )}

                  <Field
                    label="Subject (optional)"
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="What's this about?"
                  />

                  <Field
                    label="Message"
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Tell us how we can help…"
                    multiline
                    error={errors.message}
                  />
                </ScrollView>

                {/* Pinned footer so the button is always visible without scrolling */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      submitting && styles.submitButtonDisabled,
                    ]}
                    activeOpacity={0.88}
                    onPress={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.submitButtonText}>Send request</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const Field = ({ label, error, multiline, ...inputProps }) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && styles.inputMultiline,
        error && styles.inputError,
      ]}
      placeholderTextColor="#94a3b8"
      multiline={multiline}
      {...inputProps}
    />
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  sheetWrap: {
    width: "100%",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    maxHeight: "85%",
  },
  scroll: {
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  footer: {
    paddingTop: 14,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#eef2f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eef2f7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY,
  },
  subtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontSize: 14,
    color: TEXT_DARK,
    backgroundColor: "#f8fafc",
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: DANGER,
  },
  errorText: {
    fontSize: 11,
    color: DANGER,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: NAVY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});

export default NeedHelpModal;
