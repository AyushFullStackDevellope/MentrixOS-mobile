import React from "react";
import { StyleProp, TextStyle } from "react-native";
import AppText from "../components/common/AppText";

type HighlightTextProps = {
  text: string;
  query: string;
  textStyle?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

/**
 * Utility component to highlight matching substrings in text
 */
export default function HighlightText({
  text,
  query,
  textStyle,
  highlightStyle,
  numberOfLines,
}: HighlightTextProps) {
  if (!query || !query.trim()) {
    return <AppText style={textStyle} numberOfLines={numberOfLines}>{text}</AppText>;
  }

  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "ig");
  const parts = text.split(regex);

  return (
    <AppText style={textStyle} numberOfLines={numberOfLines}>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        return (
          <AppText key={`${part}-${index}`} style={isMatch ? highlightStyle : undefined}>
            {part}
          </AppText>
        );
      })}
    </AppText>
  );
}