import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform
} from "react-native";
import FraisCard from "../components/FraisCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { getFraisList, deleteFrais } from "../services/fraisService";

export default function DashboardScreen({ navigation }) {
  const { user, token } = useAuth();
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [montantMin, setMontantMin] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchFrais = async () => {
        try {
          setFraisList(await getFraisList(user.id_visiteur, token));
          setError("");
        } catch (err) {
          console.error("Erreur lors de la récupération des frais :", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFrais();
    }, [user, token])
  );

  function handleEdit(id) {
    navigation.navigate("FraisEdit", { id });
  };

  async function removeFrais(id) {
    try {
      await deleteFrais(id, token);
      setFraisList((prev) => prev.filter((f) => f.id_frais !== id));
    } catch (error) {
      Alert.alert("Erreur lors de la suppression :", error.message);
    }
  }

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette note de frais ?")) {
        removeFrais(id);
      }
      return;
    }
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer cette note de frais ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => removeFrais(id),
        },
      ]
    );
  };

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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={filteredFrais}
        keyExtractor={(item) => item.id_frais.toString()}
        renderItem={({ item }) => <FraisCard frais={item} onEdit={handleEdit} onDelete={handleDelete} />}
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
  error: {
    color: "red",
    marginBottom: 12,
  },
  filterText: {
    flex: 1,
    marginLeft: 8,
    color: "#5B6270",
  },
});
