import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { QrCode, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import AppText from '../common/AppText';
import { AppInput } from '../common/AppInput';
import { LABELS } from '../../i18n/en';
import { palette } from '../../theme';

interface TopNavProps {
  onThemeToggle: () => void;
  AlertIcon: React.ElementType;
  ThemeIcon: React.ElementType;
}

export const TopActionButtons: React.FC<TopNavProps> = ({ onThemeToggle, AlertIcon, ThemeIcon }) => {
  const theme = useTheme();
  return (
    <View style={styles.topNav}>
      <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]} activeOpacity={0.7}>
        <AlertIcon size={20} color={theme.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.iconButton, { backgroundColor: theme.card, borderColor: theme.border }]} 
        activeOpacity={0.7}
        onPress={onThemeToggle}
      >
        <ThemeIcon size={20} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export const DividerWithText: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  return (
    <View style={styles.dividerContainer}>
      <View style={[styles.dividerLine, { backgroundColor: theme.textPrimary }]} />
      <AppText style={[styles.dividerText, { color: theme.textPrimary }]}>{text}</AppText>
      <View style={[styles.dividerLine, { backgroundColor: theme.textPrimary }]} />
    </View>
  );
};

export const JoinInstituteButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.joinBtn, { backgroundColor: theme.card, borderColor: theme.border }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <QrCode size={20} color={theme.textPrimary} style={styles.qrIcon} />
      <AppText style={[styles.joinBtnText, { color: theme.textPrimary }]}>{LABELS.login.joinInstitute}</AppText>
    </TouchableOpacity>
  );
};

export const SetupInstituteCard: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.setupCard, { backgroundColor: theme.card }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.setupCardContent}>
        <AppText style={[styles.setupCardTitle, { color: theme.textSecondary }]}>{LABELS.login.setupCardTitle}</AppText>
        <View style={styles.setupCardRow}>
          <AppText style={[styles.setupCardAction, { color: theme.info }]}>{LABELS.login.setupInstitute}</AppText>
          <ChevronRight size={18} color={theme.info} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Terms and Privacy Policy footer
 */
export const TermsFooter: React.FC = () => {
  const theme = useTheme();
  return (
    <View style={styles.termsContainer}>
      <AppText style={[styles.termsText, { color: theme.textSecondary }]}>{LABELS.login.termsText}</AppText>
      <TouchableOpacity>
        <AppText style={[styles.termsLink, { color: theme.info }]}>{LABELS.login.termsLink}</AppText>
      </TouchableOpacity>
    </View>
  );
};

export const OtpInputGroup: React.FC<{ value: string[], onChange: (val: string[]) => void }> = ({ value, onChange }) => {
  const theme = useTheme();
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    const newValue = [...value];
    newValue[index] = text;
    onChange(newValue);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {value.map((digit, index) => (
        <AppInput
          key={index}
          ref={(ref) => { inputs.current[index] = ref; }}
          containerStyle={[styles.otpInput, { backgroundColor: theme.card, borderColor: theme.border }]}
          style={[styles.otpInputText, { color: theme.textPrimary }]}
          value={digit}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 40,
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 1,
  },
  qrIcon: {
    marginRight: 8,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: '700',
    fontSize: 14,
  },
  joinBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  setupCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 40,
    marginBottom: 20,
    shadowColor: palette.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  setupCardContent: {
    gap: 4,
  },
  setupCardTitle: {
    fontSize: 14,
  },
  setupCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  setupCardAction: {
    fontSize: 15,
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
  },
  termsLink: {
    fontSize: 12,
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 0,
  },
  otpInputText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
});
