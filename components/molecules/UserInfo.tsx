import { View, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { Avatar, Badge } from "react-native-paper";

import { Text, Icon } from "@/atoms";
import useColors from "@/hooks/useColors";
import { User } from "@/types";

interface UserInfoProps {
  user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        iterationDelay={3000}
        duration={2000}
        style={styles.avatarContainer}
      >
        <Avatar.Image
          source={{ uri: user.avatar || "https://via.placeholder.com/80" }}
          size={80}
          style={styles.avatar}
        />
        <Badge style={styles.levelBadge}>{user.level}</Badge>
      </Animatable.View>

      <Animatable.View
        animation="fadeIn"
        duration={800}
        delay={300}
        style={styles.info}
      >
        <View>
          <Text variant="h2" style={styles.name}>
            {user.name}
          </Text>
          <Text variant="body" style={styles.email}>
            {user.email}
          </Text>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatar: {
    backgroundColor: "#FFFFFF",
  },
  levelBadge: {
    position: "absolute",
    bottom: 0,
    right: -5,
    backgroundColor: "#DE8A2C",
    color: "#FFFFFF",
    fontWeight: "bold",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  info: {
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  email: {
    color: "#FFFFFF",
    opacity: 0.8,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    margin: 0,
    padding: 0,
    height: 16,
    width: 16,
  },
  points: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
});

export default UserInfo;
