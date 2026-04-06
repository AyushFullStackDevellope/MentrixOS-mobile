import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import AppText from './AppText';

interface AppHeaderProps {
  /** Optional right-side slot — defaults to a user initials circle if logged in */
  rightSlot?: React.ReactNode;
  /** If true, shows right slot (default: true) */
  showRight?: boolean;
}

/**
 * Common App Header with theme-aware logo + brand name ("Mentrix" + "OS" in blue)
 * Displays user initials in the right slot by default if a user is logged in.
 */
export default function AppHeader({ rightSlot, showRight = true }: AppHeaderProps) {
  const theme = useTheme();
  const { user } = useAuth();

  const logo = theme.isDark
    ? require('../../../assets/logo/logo-dark.png')
    : require('../../../assets/logo/logo-light.png');

  // Helper to get initials (e.g., "Ayush Name" -> "AN")
  const getInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(user?.full_name);

  return (
    <View style={styles.container}>
      {/* Brand: Logo + "Mentrix" + "OS" */}
      <View style={styles.brandRow}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <AppText style={[styles.brandMentrix, { color: theme.textPrimary }]}>
          Mentrix
        </AppText>
        <AppText style={styles.brandOS}>OS</AppText>
      </View>

      {/* Right slot */}
      {showRight && (
        <View>
          {rightSlot ?? (
            <View style={[styles.avatarCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {initials ? (
                <AppText style={[styles.initialsText, { color: theme.textPrimary }]}>
                  {initials}
                </AppText>
              ) : (
                <User size={20} color={theme.textPrimary} />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  brandMentrix: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  brandOS: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
    // "OS" always blue regardless of theme
    color: '#2563EB',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 16,
    fontWeight: '700',
  }
});
