import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import Navbar from "../components/Navbar";
import { loginStyles } from "../styles/loginStyles";

export default function LoginScreen() {
// 1. États locaux pour les champs du formulaire
const [login, setLogin] = useState("");
const [password, setPassword] = useState("");

const handleSubmit = () => {
    if (loginUser(login, password)) {
      navigation.navigate("Dashboard");
    } else {
      Alert.alert("Identifiants incorrects");
    }
  };
   const { loginUser } = useAuth();
   const navigation = useNavigation();
// 5. Rend le formulaire
return (
    <View style={loginStyles.container}>
      <Navbar />
      <Text style={loginStyles.title}>Connexion</Text>
      <View>
        <Text>Login :</Text>
        <TextInput
          style={loginStyles.input}
          value={login}
          onChangeText={setLogin}
        />
      </View>
      <View>
        <Text>Password :</Text>
        <TextInput
          style={loginStyles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Pressable style={loginStyles.button} onPress={handleSubmit}>
        <Text style={loginStyles.buttonText}>Se connecter</Text>
      </Pressable>
    </View>
  );
}