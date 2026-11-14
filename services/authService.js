import AsyncStorage from "@react-native-async-storage/async-storage";

// API du lycée (accessible uniquement depuis le réseau du lycée)
export const API_URL = "http://gsbfrais.julliand.ispconfig.lmdsio.com/api/";
// Fausse API locale (node mock-api/server.js) : remplacer par l'IP du PC
// export const API_URL = "http://192.168.1.170:3000/api/";

export async function signIn(login, pwd) {
  const response = await fetch(`${API_URL}visiteur/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, pwd }),
  });
  const data = await response.json();

  if (data.token) {
    await AsyncStorage.setItem("user", JSON.stringify(data.visiteur));
    await AsyncStorage.setItem("token", data.token);
  }
  return data;
}

export async function signOut() {
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("token");
}
