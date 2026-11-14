import { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import fraisData from "../data/frais.json";
import FraisCard from "../components/FraisCard";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [fraisList, setFraisList] = useState([]);

  return (
    <View style={styles.screen}>
      <Navbar />
      <View style={styles.content}>
        <Text>Bienvenue {user}</Text>
      </View>
      <FlatList
        data={fraisList}
        keyExtractor={(item) => item.id_frais.toString()}
        renderItem={({ item }) => <FraisCard frais={item} />}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
});
