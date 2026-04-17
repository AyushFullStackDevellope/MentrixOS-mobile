import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  GraduationCap, 
  User as UserIcon, 
  Users, 
  UserSquare2 // Used for Faculty to distinguish from student
} from "lucide-react-native";
import { LABELS } from "../../i18n/en";
import { layout } from "../../theme/layout";
import { spacing, radius, typography, palette } from "../../theme";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/common/AppHeader";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { selectUserContext } from "../../api/authApi";
import { getInstituteImageSource } from "../../constants/assets";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import type { ContextSelectionResponse, Institute, InstituteRole } from "../../types/session";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RoleSelectionScreenProps = {
  navigation: StackNavigationProp<AppStackParamList, "Role">;
  route: RouteProp<AppStackParamList, "Role">;
};

/**
 * Role Selection Screen — Now updated with dynamic institute icons and distinct role icons.
 */
export default function RoleSelectionScreen({ navigation, route }: RoleSelectionScreenProps) {
  const theme = useTheme();
  const { preContextToken, handleContextSelectionSuccess } = useAuth();

  const selectedInstitute: Institute = route.params.selectedInstitute;
  const roles: InstituteRole[] = selectedInstitute.roles || [];

  const [loadingRoleId, setLoadingRoleId] = useState<number | null>(null);

  // Auto-Skip if only one role
  React.useEffect(() => {
    if (roles.length === 1) {
      handleRoleSelect(roles[0]);
    }
  }, [roles]);

  const handleRoleSelect = async (role: InstituteRole) => {
    if (!preContextToken) {
      Alert.alert("Session Error", "Session expired. Please log in again.");
      return;
    }
    try {
      setLoadingRoleId(role.role_id);
      const contextData = (await selectUserContext(preContextToken, {
        tenant_id: selectedInstitute.tenant_id,
        institute_id: selectedInstitute.institute_id,
        role_id: role.role_id,
      })) as ContextSelectionResponse;

      await handleContextSelectionSuccess({
        accessToken: contextData.access_token,
        selectedInstitute,
        selectedRole: role,
      });

      navigation.replace("Dashboard", { selectedInstitute, selectedRole: role });
    } catch (error) {
      const err = error as Error;
      Alert.alert("Role Selection Failed", err.message || "Something went wrong");
    } finally {
      setLoadingRoleId(null);
    }
  };

  /**
   * Helper to differentiate Faculty vs Student icons clearly
   */
  const getRoleBranding = (roleName: string) => {
    const name = roleName.toLowerCase();
    
    // Management/Admin -> Purple Shield
    if (name.includes('admin') || name.includes('management')) 
      return { Icon: ShieldCheck, color: theme.branding.admin, bgColor: theme.branding.adminBg };
    
    // Faculty/Teacher -> Green UserSquare (More professional/instructive than student cap)
    if (name.includes('teacher') || name.includes('faculty') || name.includes('staff')) 
      return { Icon: UserSquare2, color: theme.branding.faculty, bgColor: theme.branding.facultyBg };
    
    // Student -> Blue Graduation Cap (Education-focused)
    if (name.includes('student')) 
      return { Icon: GraduationCap, color: theme.branding.student, bgColor: theme.branding.studentBg };
    
    // Parent -> Orange Users (Family-focused)
    if (name.includes('parent')) 
      return { Icon: Users, color: theme.branding.parent, bgColor: theme.branding.parentBg };
    
    return { Icon: UserIcon, color: theme.branding.default, bgColor: theme.branding.defaultBg };
  };

  // Image source for the institute branding
  const instituteSource = getInstituteImageSource(selectedInstitute?.logo || undefined);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>

        <View style={layout.adaptiveContainer}>
          <AppHeader />

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.changeInstituteButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={18} color={theme.textPrimary} style={styles.backIcon} />
            <AppText style={[styles.changeInstituteText, { color: theme.textPrimary }]}>
              {LABELS.role.changeInstitute}
            </AppText>
          </TouchableOpacity>

          {/* Selected Institute Branding Box */}
          <View style={[styles.selectedInstituteCard, { backgroundColor: theme.card, borderColor: theme.info }]}>
            <View style={[styles.selectedInstituteLogoBox, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
              {instituteSource ? (
                <Image source={instituteSource} style={styles.instituteLogo} resizeMode="contain" />
              ) : (
                <AppText style={[styles.selectedInstituteLogoText, { color: theme.textPrimary }]}>
                  {selectedInstitute?.institute_name?.charAt(0) || "I"}
                </AppText>
              )}
            </View>

            <View style={styles.selectedInstituteInfo}>
              <AppText style={[styles.selectedInstituteName, { color: theme.textPrimary }]}>
                {selectedInstitute?.institute_name || "Institute"}
              </AppText>
              <View style={styles.selectedInstituteMetaRow}>
                <MapPin size={13} color={theme.textSecondary} style={styles.metaIcon} />
                <AppText style={[styles.selectedInstituteMeta, { color: theme.textSecondary }]}>
                  {selectedInstitute ? `${selectedInstitute.city}, ${selectedInstitute.state}` : ""}
                </AppText>
              </View>
            </View>

            <CheckCircle2 size={22} color={theme.info} />
          </View>

          <View style={styles.heroSection}>
            <AppText style={[styles.title, { color: theme.textPrimary }]}>{LABELS.role.title}</AppText>
            <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>{LABELS.role.subtitle}</AppText>
          </View>

          <View style={styles.roleList}>
            {roles.length === 0 ? (
              <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>No roles available.</AppText>
            ) : (
              roles.map((role: InstituteRole) => {
                const isLoading = loadingRoleId === role.role_id;
                const { Icon, color, bgColor } = getRoleBranding(role.role_name);
                
                return (
                  <TouchableOpacity
                    key={role.role_id}
                    activeOpacity={0.7}
                    style={[styles.roleCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => handleRoleSelect(role)}
                    disabled={loadingRoleId !== null}
                  >
                    <View style={styles.roleLeft}>
                      <View style={[styles.roleIconBox, { backgroundColor: theme.isDark ? theme.inputBg : bgColor }]}>
                        <Icon size={22} color={color} />
                      </View>
                      <AppText style={[styles.roleTitle, { color: theme.textPrimary }]}>
                        {role.role_name}
                      </AppText>
                    </View>

                    {isLoading ? (
                      <ActivityIndicator size="small" color={theme.info} />
                    ) : (
                      <View style={[styles.roleArrowBox, { borderColor: theme.border }]}>
                        <ChevronRight size={18} color={theme.textSecondary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          <AppText style={[styles.supportText, { color: theme.textSecondary }]}>
            {LABELS.role.supportText}
            <AppText style={[styles.supportEmail, { color: theme.info }]}>
              {LABELS.common.supportEmail}
            </AppText>
          </AppText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  changeInstituteButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm, // approx 10
    marginBottom: spacing.xl,
  },
  backIcon: { marginRight: 6 },
  changeInstituteText: { fontSize: typography.body2.fontSize, fontWeight: "600" },
  selectedInstituteCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  selectedInstituteLogoBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    backgroundColor: palette.white, // White background for the logo itself
    overflow: 'hidden',
  },
  instituteLogo: {
    width: 36,
    height: 36,
  },
  selectedInstituteLogoText: { fontSize: typography.h3?.fontSize || 22, fontWeight: "800" },
  selectedInstituteInfo: { flex: 1 },
  selectedInstituteName: { fontSize: typography.body1?.fontSize || 16, fontWeight: "700", marginBottom: spacing.xs },
  selectedInstituteMetaRow: { flexDirection: "row", alignItems: "center" },
  metaIcon: { marginRight: spacing.xs },
  selectedInstituteMeta: { fontSize: typography.caption.fontSize, fontWeight: "400" },
  heroSection: { alignItems: "center", marginBottom: spacing.xxl },
  title: { fontSize: typography.h1.fontSize || 28, fontWeight: "800", letterSpacing: -0.5, textAlign: "center", marginBottom: 6 },
  subtitle: { fontSize: typography.body2.fontSize, lineHeight: 20, textAlign: "center", fontWeight: "400" },
  roleList: { marginBottom: spacing.lg },
  roleCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, // approx 14
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  roleTitle: { fontSize: typography.body1.fontSize, fontWeight: "700" },
  roleArrowBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  supportText: { fontSize: typography.caption.fontSize, textAlign: "center", marginTop: spacing.xxxl, lineHeight: 20 },
  supportEmail: { fontWeight: "600" },
});
