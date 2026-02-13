import React from "react";
import { IconButton, IconButtonProps } from "react-native-paper";

interface IconProps extends IconButtonProps {
  size?: number;
  iconColor?: string;
}

const Icon: React.FC<IconProps> = ({ size = 24, iconColor, ...props }) => {
  return <IconButton size={size} iconColor={iconColor} {...props} />;
};

export default Icon;
