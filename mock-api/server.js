const http = require("http");

const PORT = 3000;
const TOKEN = "52|faux-token-de-test-local";

const visiteur = {
  id_visiteur: 2,
  nom_visiteur: "Andre",
  prenom_visiteur: "David",
  type_visiteur: "V",
};

const frais = [
  { id_frais: 5, id_etat: 3, anneemois: "2025-09", id_visiteur: 2, nbjustificatifs: 2, datemodification: "2025-09-30", montantvalide: "2500.00" },
  { id_frais: 6, id_etat: 1, anneemois: "2025-10", id_visiteur: 2, nbjustificatifs: 4, datemodification: "2025-10-12", montantvalide: null },
  { id_frais: 7, id_etat: 3, anneemois: "2025-11", id_visiteur: 2, nbjustificatifs: 3, datemodification: "2025-11-20", montantvalide: "180.00" },
];

function send(res, status, body) {
  console.log("  ->", status, res.req.socket.remoteAddress);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  });
  res.end(JSON.stringify(body));
}

http
  .createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.method === "OPTIONS") return send(res, 204, {});

    if (req.method === "POST" && req.url === "/api/visiteur/auth") {
      let raw = "";
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", () => {
        let body = {};
        try { body = JSON.parse(raw); } catch {}
        console.log("  login reçu :", JSON.stringify(body.login), "pwd longueur", (body.pwd || "").length);
        if (body.login === "Andre" && body.pwd === "secret") {
          return send(res, 200, { token: TOKEN, token_type: "Bearer", visiteur });
        }
        return send(res, 401, { message: "Identifiants incorrects" });
      });
      return;
    }

    const match = req.url.match(/^\/api\/frais\/liste\/(\d+)$/);
    if (req.method === "GET" && match) {
      if (req.headers.authorization !== `Bearer ${TOKEN}`) {
        return send(res, 401, { message: "Non authentifié" });
      }
      return send(res, 200, frais.filter((f) => f.id_visiteur === Number(match[1])));
    }

    send(res, 404, { message: "Route inconnue" });
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`Fausse API GSB lancée sur le port ${PORT}`);
  });
