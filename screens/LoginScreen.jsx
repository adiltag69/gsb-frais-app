import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { StyleSheet } from "react-native";
import Navbar from "../components/Navbar";
import {loginStyles as styles} from "../styles/loginStyles.js";


export default function LoginScreen() {
  // 1. États locaux pour les champs du formulaire
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
 
  //2.
  const {loginUser} = useAuth();

  // 3. Hook pour la redirection après connexion
  const navigation = useNavigation();
  
  // 4. Déclaration de la fonction handleSubmit
  const handleSubmit = () => {
    // Appel de la fonction loginUser avec login et password
    // Pas besoin de naviguer manuellement : App.js bascule automatiquement
    // vers Dashboard dès que le contexte "user" est mis à jour.
    if (!loginUser(login, password)) {
      Alert.alert("Identifiants incorrects"); // Affiche une erreur si échec
    }
  };

  // 5. Rend le formulaire
  return (
    <View style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <View>
          <Text>Login :</Text>
          <TextInput style={styles.input} value={login} onChangeText={setLogin} />
        </View>

        <View>
          <Text>Mot de passe :</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </Pressable>
      </View>
    </View>
  );
}
