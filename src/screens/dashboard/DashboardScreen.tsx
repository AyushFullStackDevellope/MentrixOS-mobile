import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, Sun, Bell } from "lucide-react-native";
import AppText from "../../components/common/AppText";
import AppHeader from "../../components/common/AppHeader";
import { layout, spacing, radius, typography } from "../../theme";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import type { RouteProp } from "@react-navigation/native";

type DashboardScreenProps = {
  route: RouteProp<AppStackParamList, "Dashboard">;
};

type StatCardProps = {
  count: string;
  label: string;
  description: string;
  countColor: string;
};

const StatCard = ({ count, label, description, countColor }: StatCardProps) => {
  const theme = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <AppText style={[styles.statCount, { color: countColor }]}>{count}</AppText>
      <AppText style={[styles.statLabel, { color: theme.textPrimary }]}>{label}</AppText>
      <AppText style={[styles.statDescription, { color: theme.textSecondary }]}>
        {description}
      </AppText>
    </View>
  );
};

/**
 * Dashboard screen — Now with identical Theme Switcher style and proper session data.
 */
export default function DashboardScreen({ route }: DashboardScreenProps) {
  const theme = useTheme();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out from MentrixOS?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: async () => await logout() }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        <View style={layout.adaptiveContainer}>
          <AppHeader 
            rightSlot={
              <View style={styles.headerRight}>
                {/* Notifications / Alert Icon (Matching Login Style) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Bell size={20} color={theme.textPrimary} />
                </TouchableOpacity>

                {/* Theme Toggle (Matching Login Style) */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={theme.toggleTheme}
                  style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  {theme.isDark ? (
                    <Sun size={20} color={theme.textPrimary} />
                  ) : (
                    <Moon size={20} color={theme.textPrimary} />
                  )}
                </TouchableOpacity>

                {/* Profile Avatar (Click for Logout Alert) */}
                <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
                  <View style={[styles.avatarCircle, { backgroundColor: "#E98C45", borderColor: theme.border }]}>
                    <AppText style={styles.initialsText}>
                      {user?.full_name ? (user.full_name.split(' ')[0][0] + (user.full_name.split(' ').length > 1 ? user.full_name.split(' ')[1][0] : '')).toUpperCase() : "MJ"}
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <AppText style={[styles.welcomeTitle, { color: theme.textPrimary }]}>
              Welcome to MentrixOS
            </AppText>
            <AppText style={styles.userName}>
              {user?.full_name || "Michael Johnson"}
            </AppText>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard 
                count="08" 
                label="Active Institutes" 
                description="Institutes actively operating and using the platform." 
                countColor="#2563EB" 
              />
              <StatCard 
                count="05" 
                label="Inactive Institutes" 
                description="Institutes currently inactive in system." 
                countColor="#10B981" 
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                count="15+" 
                label="Total Modules" 
                description="Features enabling workflows." 
                countColor="#F59E0B" 
              />
              <StatCard 
                count="50+" 
                label="Total Users" 
                description="Registered users across institutes." 
                countColor="#8B5CF6" 
              />
            </View>
          </View>
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
    paddingBottom: spacing.xxxl,
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Icon Button Style (Matches AuthComponents.tsx)
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  initialsText: {
    fontSize: typography.body1.fontSize,
    fontWeight: '700',
    color: '#FFF',
  },

  // Welcome Section
  welcomeSection: {
    alignItems: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.xxxl,
  },
  welcomeTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "800",
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  userName: {
    fontSize: typography.h1.fontSize, // approx mapping since 28 earlier
    fontWeight: "800",
    color: "#2563EB",
    textAlign: "center",
  },

  // Stats Grid
  statsGrid: {
    gap: spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.xxl,
    borderWidth: 1,
    padding: spacing.xl,
    minHeight: 180,
  },
  statCount: {
    fontSize: typography.h1.fontSize, // 32
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  statLabel: {
    fontSize: typography.body1.fontSize,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  statDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: 18,
    fontWeight: "500",
  },
});
