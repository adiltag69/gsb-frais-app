import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#1f5f8b",
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  link: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});