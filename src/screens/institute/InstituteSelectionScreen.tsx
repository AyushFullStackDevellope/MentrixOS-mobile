import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { LABELS } from "../../i18n/en";
import InstituteCard from "../../components/institute/InstituteCard";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/common/AppHeader";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import type { Institute } from "../../types/session";

/**
 * Institute Selection Screen
 * Displays backend institutes from AuthContext, allows search & selection.
 */
export default function InstituteSelectionScreen({ navigation }: any) {
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
        <AppHeader />

        <View style={styles.heroSection}>
          <AppText style={[styles.greeting, { color: theme.textPrimary }]}>
            {`Hi, ${user?.full_name?.split(' ')[0] || 'Ayush'}`}
          </AppText>
          <AppText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {LABELS.institute.subtitle}
          </AppText>
        </View>

        <View style={[styles.searchBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={18} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder={LABELS.institute.searchPlaceholder}
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48 },
  heroSection: { alignItems: "center", marginBottom: 28 },
  greeting: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: "400" },
  searchBox: {
    height: 52,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "400", paddingVertical: 0 },
  listSection: { minHeight: 200 },
  emptyBox: { borderWidth: 1, borderRadius: 16, padding: 28, alignItems: "center" },
  emptyTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  emptySubtitle: { fontSize: 14, lineHeight: 20, textAlign: "center" },
  supportText: { fontSize: 13, textAlign: "center", marginTop: 48, lineHeight: 20 },
  supportEmail: { fontWeight: "600" },
});
