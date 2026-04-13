import React, { useState, useRef, useEffect } from "react";
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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertTriangle, Moon, Sun, Eye, EyeOff } from "lucide-react-native";
import { layout } from "../../theme/layout";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { AppButton } from "../../components/common/AppButton";
import { AppInput } from "../../components/common/AppInput";
import AppText from "../../components/common/AppText";
import { spacing, radius, typography } from "../../theme";
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
  const inputRef = useRef<TextInput>(null);

  // ── Focus Restoration ────────────────────────────────────────────────────
  // Ensures identifier input keeps focus when layout switches (e.g. from email to phone)
  useEffect(() => {
    if (authState === "initial" || authState === "email-options" || authState === "phone-options") {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [authState]);

  // API state
  const [loading, setLoading] = useState(false);

  // ── Input change: detect email vs phone ───────────────────────────────────
  // Always resets auth state back to options — allows editing email even from password state
  const handleInputChange = (text: string) => {
    setInputVal(text);
    setPassword(""); // clear password if user changes email
    
    // Check if we need to switch state (which might cause layout change/focus loss)
    let newState: AuthState = "initial";
    if (text.length === 0) {
      newState = "initial";
    } else if (/[a-zA-Z@]/.test(text)) {
      newState = "email-options";
    } else {
      newState = "phone-options";
    }

    if (newState !== authState) {
      setAuthState(newState);
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
            key="phone-input"
            ref={inputRef}
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
        key="email-input"
        ref={inputRef}
        placeholder={LABELS.login.phoneOrEmail}
        value={inputVal}
        onChangeText={handleInputChange}
        autoCapitalize="none"
        keyboardType="email-address"
        // Disabled when in password or otp states
        editable={authState === "initial" || authState === "email-options"}
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
            <TouchableOpacity 
              onPress={() => setAuthState(authState === "email-otp" ? "email-options" : "phone-options")}
              style={styles.backButton}
            >
              <AppText style={[styles.backText, { color: theme.textSecondary }]}>Back</AppText>
            </TouchableOpacity>
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
            <TouchableOpacity 
              onPress={() => setAuthState("email-options")}
              style={styles.backButton}
            >
              <AppText style={[styles.backText, { color: theme.textSecondary }]}>Back</AppText>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

            <View style={layout.adaptiveContainer}>
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
            </View>

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
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  logo: { width: 64, height: 64 },
  title: {
    fontSize: typography.h1.fontSize || 32,
    fontWeight: "800",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  subtitle: { fontSize: typography.body2.fontSize, marginBottom: spacing.xs },
  subline: { fontSize: typography.caption.fontSize },
  formArea: { marginBottom: spacing.xxl },
  phoneInputContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  countryCodeText: { fontSize: typography.body1.fontSize, fontWeight: "500" },
  phoneInput: { flex: 1 },
  rowButtons: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
  },
  otpHeading: {
    fontSize: typography.body1.fontSize,
    fontWeight: "500",
    marginBottom: spacing.lg,
  },
  resendText: { fontSize: typography.body2.fontSize, marginBottom: spacing.xxl },
  forgotPassword: {
    textAlign: "right",
    fontSize: typography.body2.fontSize,
    fontWeight: "500",
    marginBottom: spacing.xxl,
    marginTop: -4,
  },
  marketingContainer: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: spacing.md,
  },
  marketingBold: {
    fontSize: typography.body2.fontSize,
    fontWeight: "800",
    marginBottom: 6,
  },
  marketingLight: { fontSize: typography.caption.fontSize, textAlign: "center" },
  flagText: { fontSize: typography.body1?.fontSize || 18 },
  actionContainer: { marginTop: spacing.lg },
  flex1: { flex: 1 },
  resendLink: { fontWeight: "500" },
  passwordInputSpacing: { marginBottom: spacing.lg },
  boldText: { fontWeight: "700" },
  blueMetrics: { color: "#0073FF" },
  grayText: { color: "#6B7280" },
  backButton: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  backText: {
    fontSize: typography.body2.fontSize,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});