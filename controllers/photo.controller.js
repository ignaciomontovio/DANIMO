import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL = "https://api-inference.huggingface.co/models/mo-thecreator/vit-Facial-Expression-Recognition";

export const detectEmotionFromPhoto = async (req, res) => {
    try {
        if (!req.file) {
        console.log("❌ No se proporcionó imagen");
        return res.status(400).json({ error: "No se proporcionó imagen" });
        }

        console.log("✅ Imagen recibida, procesando...");

        const base64Image = req.file.buffer.toString("base64");
        const inputData = `data:${req.file.mimetype};base64,${base64Image}`;

        console.log("➡️ Enviando imagen al modelo de Hugging Face...");
        const response = await axios.post(
        HF_MODEL,
        { inputs: inputData },
        {
            headers: {
            Authorization: `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json",
            },
        }
        );

        const result = response.data;

        if (!result || result.length === 0) {
        console.log("❌ No se detectaron emociones en la foto");
        return res.status(404).json({ error: "No se detectaron emociones en la foto" });
        }

        console.log("📊 Resultados del modelo:", result);

        // Traducción de emociones en minúsculas
        const traduccion = {
        anger: "Enojo",
        disgust: "Enojo",
        fear: "Miedo",
        happy: "Alegria",
        sad: "Tristeza",
        surprise: "Ansiedad",
        neutral: "Neutral" // referencia interna
        };

        // Normalizar labels a minúsculas y ordenar por score descendente
        const ordenado = result
        .map(e => ({ ...e, label: e.label.toLowerCase() }))
        .sort((a, b) => b.score - a.score);

        console.log("📈 Scores de todas las emociones traducidas:");
        ordenado.forEach(e => {
        const label = traduccion[e.label] || e.label;
        console.log(`  - ${label}: ${e.score.toFixed(3)}`);
        });

        // Elegir emoción predominante, ignorando Neutral si es la mayor
        let emocionPredominante = ordenado[0];
        if (emocionPredominante.label === "neutral" && ordenado.length > 1) {
        console.log("⚠️ Emoción principal es Neutral, tomando la segunda más probable");
        emocionPredominante = ordenado[1];
        }

        // Traducir y capitalizar la primera letra
        let emocionTraducida = traduccion[emocionPredominante.label] || "Desconocida";
        emocionTraducida = emocionTraducida.charAt(0).toUpperCase() + emocionTraducida.slice(1);

        console.log("🎯 Emoción seleccionada:", emocionTraducida);

        return res.json({ emotion: emocionTraducida });

    } catch (err) {
        console.error("❌ Error en /photo:", err.response?.data || err.message);
        return res.status(500).json({ error: "Error al procesar la foto con HF" });
    }
};


