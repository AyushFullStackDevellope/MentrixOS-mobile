import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import HighlightText from "../../utils/highlightText";
import { useTheme } from "../../hooks/useTheme";
import { getInstituteImageSource } from "../../constants/assets";

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

/**
 * Institute Card component — recently redesigned by user, now restored with local logo support.
 */
export default function InstituteCard({ item, search, onPress }: Props) {
  const theme = useTheme();
  const metaText = `${item.city || ""}${item.city && item.state ? ", " : ""}${item.state || ""}`;

  // Decide image source using shared utility
  const imageSource = getInstituteImageSource(item.logo);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.leftSection}>
        {imageSource ? (
          <Image source={imageSource} style={styles.logo} resizeMode="contain" />
        ) : (
          <View
            style={[
              styles.logoFallback,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.logoText, { color: theme.textPrimary }]}>
              {item.name?.charAt(0)?.toUpperCase() || "I"}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <HighlightText
            text={item.name || ""}
            query={search}
            textStyle={[styles.name, { color: theme.textPrimary }]}
            highlightStyle={[styles.highlight, { color: theme.info }]}
          />

          <View style={styles.locationRow}>
            <Text style={[styles.locationIcon, { color: theme.textSecondary }]}>⌖</Text>
            <HighlightText
              text={metaText}
              query={search}
              textStyle={[styles.location, { color: theme.textSecondary }]}
              highlightStyle={[styles.highlightLocation, { color: theme.info }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.type, { color: theme.textSecondary }]}>
          {item.type || ""}
        </Text>

        <View
          style={[
            styles.arrowBox,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.arrow, { color: theme.textPrimary }]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 96,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 12,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
  },
  logoFallback: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
  },
  content: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    marginBottom: 6,
  },
  highlight: {
    fontWeight: "800",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  location: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  highlightLocation: {
    fontWeight: "700",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  type: {
    fontSize: 15,
    fontWeight: "700",
    textTransform: "lowercase",
    marginBottom: 10,
  },
  arrowBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 30,
    lineHeight: 30,
    marginTop: -2,
  },
});