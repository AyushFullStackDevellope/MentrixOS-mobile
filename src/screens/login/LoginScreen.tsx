import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle, Moon, Sun, Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { AppButton } from "../../components/common/AppButton";
import { AppInput } from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import {
  TopActionButtons,
  DividerWithText,
  JoinInstituteButton,
  SetupInstituteCard,
  TermsFooter,
  OtpInputGroup,
} from "../../components/auth/AuthComponents";
import { LABELS } from "../../i18n/en";
import { loginUser, getMyInstitutesAndRoles, selectUserContext } from "../../api/authApi";

type AuthState = "initial" | "email-options" | "phone-options" | "email-otp" | "phone-otp" | "password";

export default function LoginScreen({ navigation }: any) {
  const { handleLoginSuccess, handleContextSelectionSuccess } = useAuth();
  const theme = useTheme();

  // UI flow state
  const [authState, setAuthState] = useState<AuthState>("initial");
  const [inputVal, setInputVal] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // API state
  const [loading, setLoading] = useState(false);

  // ── Input change: detect email vs phone ───────────────────────────────────
  // Always resets auth state back to options — allows editing email even from password state
  const handleInputChange = (text: string) => {
    setInputVal(text);
    setPassword(""); // clear password if user changes email
    if (text.length === 0) {
      setAuthState("initial");
    } else if (/[a-zA-Z@]/.test(text)) {
      setAuthState("email-options");
    } else {
      setAuthState("phone-options");
    }
  };

  // ── Password login via backend ────────────────────────────────────────────
  const handleLogin = async () => {
    if (!inputVal.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const loginData: any = await loginUser(inputVal.trim(), password.trim());
      
      // Robust token extraction — handles different backend naming conventions
      const token = loginData.pre_context_token || loginData.preContextToken || loginData.token;
      
      if (!token) {
        throw new Error("No session token received from server");
      }

      const institutes = await getMyInstitutesAndRoles(token);
      await handleLoginSuccess({
        preContextToken: token,
        user: loginData.user,
        institutes,
      });

      // ── Streamline Skip Logic ─────────────────────────────────────────────
      if (institutes.length === 1) {
        const singleInst = institutes[0];
        const roles = singleInst.roles || [];

        if (roles.length === 1) {
          // Exactly 1 institute and 1 role — skip both, jump to Dashboard
          const singleRole = roles[0];
          const contextData = await selectUserContext(token, {
            tenant_id: singleInst.tenant_id,
            institute_id: singleInst.institute_id,
            role_id: singleRole.role_id,
          });

          await handleContextSelectionSuccess({
            accessToken: contextData.access_token,
            selectedInstitute: singleInst,
            selectedRole: singleRole,
          });
          // App Navigator will load Dashboard automatically via Context rerender
        } else if (roles.length > 1) {
          // 1 institute but multiple roles — skip institute selection, jump to roles
          navigation.replace("App", {
            screen: "Role",
            params: { selectedInstitute: singleInst }
          });
        }
      } else {
        // Multiple institutes — normal flow
        navigation.replace("App");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = () => {
    if (authState === "email-options") setAuthState("email-otp");
    else if (authState === "phone-options") setAuthState("phone-otp");
  };

  const handleUsePassword = () => {
    setAuthState("password");
  };

  // ── Render: input area ────────────────────────────────────────────────────
  const renderInputArea = () => {
    if (authState === "phone-options" || authState === "phone-otp") {
      return (
        <View style={styles.phoneInputContainer}>
          <View style={[styles.countryCode, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <AppText style={styles.flagText}>🇮🇳</AppText>
            <AppText style={[styles.countryCodeText, { color: theme.textPrimary }]}>+91</AppText>
          </View>
          <AppInput
            containerStyle={styles.phoneInput}
            placeholder={LABELS.login.phoneNumber}
            value={inputVal}
            onChangeText={handleInputChange}
            keyboardType="phone-pad"
            editable={authState === "phone-options"}
          />
        </View>
      );
    }
    return (
      <AppInput
        placeholder={LABELS.login.phoneOrEmail}
        value={inputVal}
        onChangeText={handleInputChange}
        autoCapitalize="none"
        keyboardType="email-address"
        // Always editable — user can tap and change email even when password field is shown
        editable={authState !== "email-otp"}
      />
    );
  };

  // ── Render: action area below input ───────────────────────────────────────
  const renderActionArea = () => {
    switch (authState) {
      case "initial":
        return null;

      case "phone-options":
        return (
          <View style={styles.actionContainer}>
            <AppButton
              title={LABELS.login.sendCode}
              onPress={handleSendCode}
              disabled={inputVal.length < 5}
            />
          </View>
        );

      case "email-options":
        return (
          <View style={styles.rowButtons}>
            <AppButton title={LABELS.login.sendCode} onPress={handleSendCode} containerStyle={styles.flex1} />
            <AppButton title={LABELS.login.usePassword} onPress={handleUsePassword} containerStyle={styles.flex1} />
          </View>
        );

      case "email-otp":
      case "phone-otp":
        return (
          <View style={styles.actionContainer}>
            <AppText style={[styles.otpHeading, { color: theme.info }]}>{LABELS.login.enterCode}</AppText>
            <OtpInputGroup value={otp} onChange={setOtp} />
            <AppText style={[styles.resendText, { color: theme.textSecondary }]}>
              {LABELS.login.didntGetCode}{" "}
              <AppText style={[styles.resendLink, { color: theme.info }]}>{LABELS.login.resendCode}</AppText>
            </AppText>
            <AppButton title={LABELS.login.continueBtn} onPress={() => {}} />
          </View>
        );

      case "password":
        return (
          <View style={styles.actionContainer}>
            <AppInput
              placeholder={LABELS.login.passwordPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              containerStyle={styles.passwordInputSpacing}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                  {showPassword ? (
                    <Eye size={20} color={theme.textSecondary} />
                  ) : (
                    <EyeOff size={20} color={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              }
            />
            <AppText style={[styles.forgotPassword, { color: theme.info }]}>
              {LABELS.login.forgotPassword}
            </AppText>
            {loading ? (
              <ActivityIndicator color={theme.info} />
            ) : (
              <AppButton title={LABELS.login.continueBtn} onPress={handleLogin} />
            )}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            <TopActionButtons
              onThemeToggle={theme.toggleTheme}
              AlertIcon={AlertTriangle}
              ThemeIcon={theme.isDark ? Sun : Moon}
            />

            <View style={styles.header}>
              <Image
                source={
                  theme.isDark
                    ? require("../../../assets/logo/logo-dark.png")
                    : require("../../../assets/logo/logo-light.png")
                }
                style={styles.logo}
                resizeMode="contain"
              />
              <AppText style={[styles.title, { color: theme.textPrimary }]}>
                Mentrix<AppText style={{ color: theme.info }}>OS</AppText>
              </AppText>
              <AppText style={[styles.subtitle, { color: theme.textPrimary }]}>
                <AppText style={styles.boldText}>{LABELS.login.formula.part1}</AppText>
                <AppText style={[styles.boldText, { color: theme.warning }]}>{LABELS.login.formula.part2}</AppText>
                <AppText style={styles.boldText}>{LABELS.login.formula.part3}</AppText>
                <AppText style={[styles.blueMetrics, styles.boldText]}>{LABELS.login.formula.part4}</AppText>
              </AppText>
              <AppText style={[styles.subline, { color: theme.textSecondary }]}>
                {LABELS.login.subline.part1}
                <AppText style={[styles.boldText, { color: theme.textPrimary }]}>{LABELS.login.subline.part2}</AppText>
                {LABELS.login.subline.part3}
              </AppText>
            </View>

            <View style={styles.formArea}>
              {renderInputArea()}
              {renderActionArea()}
              {(authState === "initial" || authState === "email-options" || authState === "phone-options") && (
                <>
                  <DividerWithText text={LABELS.login.or} />
                  <JoinInstituteButton onPress={() => {}} />
                </>
              )}
            </View>

            <View style={styles.marketingContainer}>
              <AppText style={[styles.marketingBold, { color: theme.textPrimary }]}>{LABELS.login.marketingBold}</AppText>
              <AppText style={[styles.marketingLight, { color: theme.textSecondary }]}>{LABELS.login.marketingLight}</AppText>
            </View>

            <SetupInstituteCard onPress={() => {}} />
            <TermsFooter />

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 36,
  },
  logo: { width: 64, height: 64 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 16,
  },
  subtitle: { fontSize: 14, marginBottom: 4 },
  subline: { fontSize: 13 },
  formArea: { marginBottom: 30 },
  phoneInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    gap: 8,
  },
  countryCodeText: { fontSize: 16, fontWeight: "500" },
  phoneInput: { flex: 1 },
  rowButtons: {
    marginTop: 16,
    flexDirection: "row",
    gap: 12,
  },
  otpHeading: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  resendText: { fontSize: 14, marginBottom: 24 },
  forgotPassword: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 24,
    marginTop: -4,
  },
  marketingContainer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 10,
  },
  marketingBold: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 6,
  },
  marketingLight: { fontSize: 13, textAlign: "center" },
  flagText: { fontSize: 18 },
  actionContainer: { marginTop: 16 },
  flex1: { flex: 1 },
  resendLink: { fontWeight: "500" },
  passwordInputSpacing: { marginBottom: 16 },
  boldText: { fontWeight: "700" },
  blueMetrics: { color: "#0073FF" },
  grayText: { color: "#6B7280" },
});