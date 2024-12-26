import React, {FC, MutableRefObject, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputSelectionChangeEventData,
  View,
} from 'react-native';

import {
  defaultMentionTextStyle,
  generateValueFromPartsAndChangedText,
  generateValueWithAddedSuggestion,
  getMentionPartSuggestionKeywords,
  isMentionPartType,
  parseValue,
} from './Mention/utils';
import {useTheme} from '../../context/ThemeContext';

const MentionInput = ({
  value,
  onChange,

  partTypes = [],

  inputRef: propInputRef,

  containerStyle,

  onSelectionChange,

  ...textInputProps
}) => {
  const textInput = useRef(null);

  const [selection, setSelection] = useState({start: 0, end: 0});

  const {plainText, parts} = useMemo(
    () => parseValue(value, partTypes),
    [value, partTypes],
  );

  const handleSelectionChange = event => {
    setSelection(event.nativeEvent.selection);

    onSelectionChange && onSelectionChange(event);
  };

  /**
   * Callback that trigger on TextInput text change
   *
   * @param changedText
   */
  const onChangeInput = changedText => {
    onChange(
      generateValueFromPartsAndChangedText(parts, plainText, changedText),
    );
  };

  /**
   * We memoize the keyword to know should we show mention suggestions or not
   */
  const keywordByTrigger = useMemo(() => {
    return getMentionPartSuggestionKeywords(
      parts,
      plainText,
      selection,
      partTypes,
    );
  }, [parts, plainText, selection, partTypes]);

  /**
   * Callback on mention suggestion press. We should:
   * - Get updated value
   * - Trigger onChange callback with new value
   */
  const onSuggestionPress = mentionType => suggestion => {
    const newValue = generateValueWithAddedSuggestion(
      parts,
      mentionType,
      plainText,
      selection,
      suggestion,
    );

    if (!newValue) {
      return;
    }

    onChange(newValue);

    /**
     * Move cursor to the end of just added mention starting from trigger string and including:
     * - Length of trigger string
     * - Length of mention name
     * - Length of space after mention (1)
     *
     * Not working now due to the RN bug
     */
    // const newCursorPosition = currentPart.position.start + triggerPartIndex + trigger?.length +
    // suggestion.name?.length + 1;

    // textInput.current?.setNativeProps({selection: {start: newCursorPosition, end: newCursorPosition}});
  };

  const handleTextInputRef = ref => {
    textInput.current = ref;

    if (propInputRef) {
      if (typeof propInputRef === 'function') {
        propInputRef(ref);
      } else {
        propInputRef.current = ref;
      }
    }
  };

  const renderMentionSuggestions = mentionType => (
    <React.Fragment key={mentionType.trigger}>
      {mentionType.renderSuggestions &&
        mentionType.renderSuggestions({
          keyword: keywordByTrigger[mentionType.trigger],
          onSuggestionPress: onSuggestionPress(mentionType),
        })}
    </React.Fragment>
  );
  const Colors = useTheme();
  // const styles = getStyles(Colors);
  return (
    <KeyboardAvoidingView style={containerStyle}>
      {partTypes
        ?.filter(
          one =>
            isMentionPartType(one) &&
            one.renderSuggestions != null &&
            !one.isBottomMentionSuggestionsRender,
        )
        .map(renderMentionSuggestions)}

      <TextInput
        autoCorrect={true}
        autoCapitalize="sentences"
        keyboardAppearance={
          Colors.Background_color === '#F5F5F5' ? 'light' : 'dark'
        }
        multiline
        {...textInputProps}
        ref={handleTextInputRef}
        autoFocus={true}
        onChangeText={onChangeInput}
        onSelectionChange={handleSelectionChange}>
        <Text>
          {parts.map(({text, partType, data}, index) =>
            partType ? (
              <Text
                key={`${index}-${data?.trigger ?? 'pattern'}`}
                style={partType.textStyle ?? defaultMentionTextStyle}>
                {text}
              </Text>
            ) : (
              <Text key={index}>{text}</Text>
            ),
          )}
        </Text>
      </TextInput>

      {partTypes
        ?.filter(
          one =>
            isMentionPartType(one) &&
            one.renderSuggestions != null &&
            one.isBottomMentionSuggestionsRender,
        )
        .map(renderMentionSuggestions)}
    </KeyboardAvoidingView>
  );
};

export {MentionInput};
