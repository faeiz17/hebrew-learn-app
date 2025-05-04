// StarRating.js  (or keep it in the same file)
import React, { useMemo } from "react";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StarRating = React.memo(({ difficulty }) => {
  // map difficulty → colour + number of filled stars
  const config = {
    easy: { color: "#00D100", stars: 1 }, // green
    medium: { color: "#FFD700", stars: 2 }, // yellow
    hard: { color: "#FF3333", stars: 3 }, // red
  };

  const { color, stars } = config[(difficulty || "").toLowerCase()] || {
    color: "#41B2EB",
    stars: 0,
  };

  // build exactly 3 icons, memoised for performance
  const icons = useMemo(
    () =>
      [0, 1, 2].map((i) => (
        <MaterialCommunityIcons
          key={i}
          name={i < stars ? "star" : "star-outline"}
          size={20}
          color={i < stars ? color : "#ccc"} // grey outline for “empty”
          style={{ marginHorizontal: 2 }}
        />
      )),
    [color, stars]
  );

  return <View style={{ flexDirection: "row" }}>{icons}</View>;
});

export default StarRating;
