import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  Switch,
} from "react-native";
import Navbar from "../components/Navbar";
import FraisCard from "../components/FraisCard";
import fraisData from "../data/frais.json";

export default function DashboardScreen() {
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [montantMin, setMontantMin] = useState("");

  // Étape 3 : simulation d'un appel API (500 ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFraisList(fraisData);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Étape 4 : filtres chaînés
  const filteredFrais = fraisList
    // 1) Montant validé non null (si le switch est activé)
    .filter((f) => !filterNonNull || f.montantvalide !== null)
    // 2) Recherche par année-mois OU id visiteur
    .filter(
      (frais) =>
        frais.anneemois.includes(searchTerm) ||
        String(frais.id_visiteur).includes(searchTerm)
    )
    // 3) Montant validé supérieur à la valeur saisie
    .filter(
      (f) =>
        montantMin === "" ||
        isNaN(parseFloat(montantMin)) ||
        (f.montantvalide !== null && f.montantvalide > parseFloat(montantMin))
    );

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <TextInput
          placeholder="Rechercher par année-mois ou ID visiteur..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <Switch value={filterNonNull} onValueChange={setFilterNonNull} />
          <Text style={styles.filterText}>
            Afficher seulement les frais avec un montant validé
          </Text>
        </View>

        <TextInput
          placeholder="Montant validé minimum..."
          value={montantMin}
          onChangeText={setMontantMin}
          keyboardType="numeric"
          style={styles.searchInput}
        />

        <FlatList
          data={filteredFrais}
          keyExtractor={(item) => item.id_frais.toString()}
          renderItem={({ item }) => <FraisCard frais={item} />}
          ListEmptyComponent={<Text style={styles.empty}>Aucune note de frais.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filterText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#161B33",
  },
  empty: {
    textAlign: "center",
    color: "#5B6270",
    marginTop: 20,
  },
});
