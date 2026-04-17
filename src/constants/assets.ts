/**
 * Centralized asset mapping for local logos and icons
 * Used for both Institute and Role selection screens
 */

export const localLogos: Record<string, number> = {
  "logo-one.png": require("../../assets/institute-logos/logo-one.png"),
  "logo-two.png": require("../../assets/institute-logos/logo-two.png"),
  "logo-three.png": require("../../assets/institute-logos/logo-three.png"),
  "logo-four.png": require("../../assets/institute-logos/logo-four.png"),
};

export const getInstituteImageSource = (logo?: string) => {
  if (!logo) return null;

  if (logo.startsWith("http://") || logo.startsWith("https://")) {
    return { uri: logo };
  }

  if (localLogos[logo]) {
    return localLogos[logo];
  }

  return null;
};