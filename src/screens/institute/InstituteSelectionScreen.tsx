import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { LABELS } from "../../i18n/en";
import { layout } from "../../theme/layout";
import { spacing, radius, typography } from "../../theme";
import InstituteCard from "../../components/institute/InstituteCard";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/common/AppHeader";
import { AppInput } from "../../components/common/AppInput";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import type { Institute } from "../../types/session";
import { AppStackParamList } from "../../navigation/types";

type InstituteSelectionScreenProps = {
  navigation: StackNavigationProp<AppStackParamList, "Institute">;
};

/**
 * Institute Selection Screen
 * Displays backend institutes from AuthContext, allows search & selection.
 */
export default function InstituteSelectionScreen({ navigation }: InstituteSelectionScreenProps) {
  const theme = useTheme();
  const { institutes, user } = useAuth();
  const [search, setSearch] = useState("");

  // ── Auto-Skip Logic ──────────────────────────────────────────────────────
  useEffect(() => {
    if (institutes?.length === 1) {
      handleSelectInstitute(institutes[0]);
    }
  }, [institutes]);

  // List of available local logos to assign to items
  const localLogos = ["logo-one.png", "logo-two.png", "logo-three.png", "logo-four.png"];

  // Filter institute list based on search query AND Assign local logos if missing
  const filteredInstitutes = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = institutes || [];

    // Step 1: Assign logos based on index if the item doesn't have one
    const listWithLogos = list.map((item, idx) => ({
      ...item,
      logo: item.logo || localLogos[idx % localLogos.length]
    }));

    // Step 2: Filter
    if (!query) return listWithLogos;
    return listWithLogos.filter((item: Institute) =>
      item.institute_name?.toLowerCase().includes(query) ||
      item.city?.toLowerCase().includes(query) ||
      item.state?.toLowerCase().includes(query) ||
      item.type?.toLowerCase().includes(query)
    );
  }, [search, institutes]);

  const handleSelectInstitute = (item: Institute) => {
    navigation.navigate("Role", { selectedInstitute: item });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={layout.adaptiveContainer}>
          <AppHeader />

          <View style={styles.heroSection}>
            <AppText style={[styles.greeting, { color: theme.textPrimary }]}>
              {`Hi, ${user?.full_name?.split(' ')[0] || 'Ayush'}! 👋`}
            </AppText>
            <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>
              {LABELS.institute.subtitle}
            </AppText>
          </View>

          <AppInput
            containerStyle={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}
            leftIcon={<Search size={18} color={theme.textSecondary} />}
            placeholder={LABELS.institute.searchPlaceholder}
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />

          <View style={styles.listSection}>
            {filteredInstitutes.length === 0 ? (
              <View style={[styles.emptyBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <AppText style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  {LABELS.institute.emptyTitle}
                </AppText>
                <AppText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  {LABELS.institute.emptySubtitle}
                </AppText>
              </View>
            ) : (
              filteredInstitutes.map((item: Institute) => (
                <InstituteCard
                  key={item.institute_id}
                  item={{
                    id: item.institute_id.toString(),
                    name: item.institute_name,
                    city: item.city,
                    state: item.state,
                    type: item.type,
                    logo: item.logo || undefined,
                  }}
                  search={search}
                  onPress={() => handleSelectInstitute(item)}
                />
              ))
            )}
          </View>

          <AppText style={[styles.supportText, { color: theme.textSecondary }]}>
            {LABELS.institute.supportText}
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
  contentContainer: { 
    paddingHorizontal: spacing.xl, 
    paddingTop: spacing.md, 
    paddingBottom: spacing.xxxl 
  },
  heroSection: { alignItems: "center", marginBottom: spacing.xl },
  greeting: { 
    fontSize: typography.h2.fontSize, 
    fontWeight: "800", 
    marginBottom: spacing.xs
  },
  subtitle: { 
    fontSize: typography.body2.fontSize, 
    fontWeight: "400",
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  searchBox: {
    height: 54,
    borderRadius: 999, // Pill shape matching screenshot
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { 
    flex: 1, 
    fontSize: typography.body1.fontSize, 
    fontWeight: "400", 
    paddingVertical: 0 
  },
  listSection: { minHeight: 200 },
  emptyBox: { 
    borderWidth: 1, 
    borderRadius: radius.lg, 
    padding: spacing.xxl, 
    alignItems: "center" 
  },
  emptyTitle: { 
    fontSize: typography.body1.fontSize, 
    fontWeight: "700", 
    marginBottom: spacing.xs 
  },
  emptySubtitle: { 
    fontSize: typography.caption.fontSize, 
    lineHeight: 20, 
    textAlign: "center" 
  },
  supportText: { 
    fontSize: typography.caption.fontSize, 
    textAlign: "center", 
    marginTop: spacing.xxxl, 
    lineHeight: 20 
  },
  supportEmail: { fontWeight: "600" },
});
