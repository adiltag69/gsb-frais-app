import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Switch } from "react-native";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import fraisData from "../data/frais.json";
import FraisCard from "../components/FraisCard";

export default function DashboardScreen() {
  const { user } = useAuth();
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [montantMin, setMontantMin] = useState("");

  useEffect(() => {
    // Simulation d'un appel API avec un délai de 500 ms
    setTimeout(() => {
      setFraisList(fraisData);
      setLoading(false);
    }, 500);
  }, []);

  // Logique de filtrage : filtre les frais en fonction du terme de recherche
  const filteredFrais = fraisList
    .filter((f) => !filterNonNull || f.montantvalide !== null)
    .filter((frais) =>
      frais.anneemois.includes(searchTerm) ||
      frais.id_visiteur.toString().includes(searchTerm)
    )
    .filter((f) => {
      const min = parseFloat(montantMin.replace(",", "."));
      return isNaN(min) || (f.montantvalide !== null && f.montantvalide > min);
    });

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.screen}>
      <Navbar />
      <View style={styles.content}>
        <Text>Bienvenue {user?.prenom_visiteur}</Text>
        <TextInput
          placeholder="Rechercher par année-mois ou ID visiteur..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        <View style={styles.filterRow}>
          <Switch
            value={filterNonNull}
            onValueChange={setFilterNonNull}
          />
          <Text style={styles.filterText}>Afficher seulement les frais avec un montant validé</Text>
        </View>
        <TextInput
          placeholder="Montant validé minimum..."
          value={montantMin}
          onChangeText={setMontantMin}
          keyboardType="numeric"
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredFrais}
        keyExtractor={(item) => item.id_frais.toString()}
        renderItem={({ item }) => <FraisCard frais={item} />}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5F6FA" },
  content: { padding: 16 },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D0D4DC",
    backgroundColor: "#FFFFFF",
    marginTop: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  filterText: {
    flex: 1,
    marginLeft: 8,
    color: "#5B6270",
  },
});
