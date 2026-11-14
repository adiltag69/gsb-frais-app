import { useState, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Switch, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { API_URL } from "../config";
import FraisCard from "../components/FraisCard";

export default function DashboardScreen() {
  const { user, token } = useAuth();
  const [fraisList, setFraisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNonNull, setFilterNonNull] = useState(true);
  const [montantMin, setMontantMin] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchFrais = async () => {
        try {
          const response = await fetch(`${API_URL}frais/liste/${user.id_visiteur}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
          }
          const data = await response.json();
          setFraisList(data);
          setLoading(false);
        } catch (error) {
          console.error("Erreur lors de la récupération des frais : ", error);
          setLoading(false);
        }
      };
      fetchFrais();
    }, [user, token])
  );

  function handleEdit(id) {
    navigation.navigate("FraisEdit", { id });
  };

  const supprimerFrais = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}frais/suppr`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id_frais: id }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Erreur HTTP ${response.status}`);
      }
      setFraisList((liste) => liste.filter((f) => f.id_frais !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleDelete = (id) => {
    if (Platform.OS === "web") {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette note de frais ?")) {
        supprimerFrais(id);
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
          onPress: () => supprimerFrais(id),
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
  filterText: {
    flex: 1,
    marginLeft: 8,
    color: "#5B6270",
  },
});
