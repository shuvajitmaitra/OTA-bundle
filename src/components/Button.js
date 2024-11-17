import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import color from "../constants/color";
const Button = ({
  style,
  onPress,
  title,
  oulined,
  iconLeft,
  iconRight,
  loading,
}) => {
  return (
    <TouchableOpacity
      disabled={loading}
      style={[oulined ? styles.buttonOulined : styles.button, { ...style }]}
      onPress={onPress}
      activeOpacity={0.5}
    >
      {loading ? (
        <ActivityIndicator
          color={oulined ? "black" : "#fff"}
          animating={true}
          size="large"
          style={{ marginRight: 5 }}
        />
      ) : (
        iconLeft && iconLeft
      )}
      <Text
        style={[
          styles.buttonText,
          {
            color: oulined ? color.primary : "#fff",
          },
        ]}
      >
        {title}
      </Text>
      {iconRight && iconRight}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // width: '100%',
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: color.primary,
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonOulined: {
    // width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    color: color.primary,
    borderColor: color.primary,
    borderWidth: 1,
    // marginTop: 15,
  },
});
export default Button;
