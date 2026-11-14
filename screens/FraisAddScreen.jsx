import { View, StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import FraisForm from "../components/FraisForm";

export default function FraisAddScreen() {
  return (
    <View style={styles.screen}>
      <Navbar />
      <FraisForm />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
