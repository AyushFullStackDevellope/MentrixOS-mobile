import React from "react";
import AppText from "../components/common/AppText";

type HighlightTextProps = {
  text: string;
  query: string;
  textStyle?: any;
  highlightStyle?: any;
};

/**
 * Utility component to highlight matching substrings in text
 */
export default function HighlightText({
  text,
  query,
  textStyle,
  highlightStyle,
}: HighlightTextProps) {
  if (!query || !query.trim()) {
    return <AppText style={textStyle}>{text}</AppText>;
  }

  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "ig");
  const parts = text.split(regex);

  return (
    <AppText style={textStyle}>
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