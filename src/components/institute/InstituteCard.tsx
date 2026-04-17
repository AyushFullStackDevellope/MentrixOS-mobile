import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import AppText from "../common/AppText";
import { palette } from "../../theme";
import HighlightText from "../../utils/highlightText";
import { useTheme } from "../../hooks/useTheme";
import { getInstituteImageSource } from "../../constants/assets";
import { MapPin, ChevronRight } from "lucide-react-native";

type InstituteItem = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  logo?: string;
};

type Props = {
  item: InstituteItem;
  search: string;
  onPress: () => void;
};

export default function InstituteCard({ item, search, onPress }: Props) {
  const theme = useTheme();

  const metaText =
    item.city && item.state
      ? `${item.city} ${item.state}`
      : item.city || item.state || "Location not available";

  const imageSource = getInstituteImageSource(item.logo);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      {/* LEFT: Logo */}
      <View style={styles.logoWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logoFallback, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <AppText style={[styles.logoInitial, { color: theme.textPrimary }]}>
              {item.name?.charAt(0)?.toUpperCase() || "I"}
            </AppText>
          </View>
        )}
      </View>

      {/* CENTER: Name + Location */}
      <View style={styles.centerContent}>
        <HighlightText
          text={item.name || ""}
          query={search}
          numberOfLines={1}
          textStyle={[styles.name, { color: theme.textPrimary }]}
          highlightStyle={[styles.nameHighlight, { color: theme.info }]}
        />
        <View style={styles.locationRow}>
          <MapPin size={11} color={theme.textSecondary} style={styles.pinIcon} />
          <HighlightText
            text={metaText}
            query={search}
            numberOfLines={1}
            textStyle={[styles.location, { color: theme.textSecondary }]}
            highlightStyle={[styles.locationHighlight, { color: theme.info }]}
          />
        </View>
      </View>

      {/* RIGHT: Type label + Arrow (horizontal row) */}
      <View style={styles.rightSection}>
        <AppText style={[styles.typeLabel, { color: theme.textSecondary }]} numberOfLines={1}>
          {item.type || ""}
        </AppText>
        <View style={[styles.arrowBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <ChevronRight size={18} color={theme.textPrimary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },

  // Logo
  logoWrap: {
    marginRight: 12,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.white,
  },
  logoFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoInitial: {
    fontSize: 20,
    fontWeight: "700",
  },

  // Center content
  centerContent: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  nameHighlight: {
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pinIcon: {
    marginRight: 4,
  },
  location: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    flexShrink: 1,
  },
  locationHighlight: {
    fontWeight: "700",
  },

  // Right section — horizontal row: [Type Label]  [> Arrow]
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    gap: 10,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  arrowBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
});