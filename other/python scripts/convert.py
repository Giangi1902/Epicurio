import os
import base64
import json
import cloudinary
import cloudinary.uploader
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

# 📌 Carica le variabili d'ambiente dal file .env
load_dotenv()

# 📌 Configura Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# 📌 Imposta la cartella contenente i file JSON
FOLDER_PATH = "../zzz/Recipes"  # Modifica con il percorso della tua cartella
print("🌍 Cloudinary Config:", os.getenv("CLOUDINARY_CLOUD_NAME"), os.getenv("CLOUDINARY_API_KEY"))

def convert_and_upload(file_path):
    """
    Converti un'immagine Base64 in WebP, caricala su Cloudinary e sostituisci l'URL nel file JSON.
    """
    try:
        # 📌 1. Leggi il file JSON
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 📌 2. Verifica se esiste il campo "imageBase64"
        if "imageBase64" not in data or not data["imageBase64"]:
            print(f"❌ Nessuna immagine Base64 trovata in {file_path}")
            return

        # 📌 3. Decodifica Base64
        base64_str = data["imageBase64"].split(",")[-1]  # Rimuove il prefisso data:image
        image_data = base64.b64decode(base64_str)

        # 📌 4. Converti in WebP con PIL
        img = Image.open(BytesIO(image_data))
        img = img.convert("RGB")  # WebP non supporta trasparenza al 100%
        output_buffer = BytesIO()
        img.save(output_buffer, format="WebP", quality=85)  # Qualità ottimizzata
        output_buffer.seek(0)

        # 📌 5. Carica su Cloudinary
        upload_result = cloudinary.uploader.upload(output_buffer, folder="recipes")

        # 📌 6. Sovrascrivi "imageBase64" con l'URL dell'immagine compressa
        data["imageBase64"] = upload_result["secure_url"]

        # 📌 7. Salva il file aggiornato
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print(f"✅ {file_path} aggiornato con URL: {upload_result['secure_url']}")

    except Exception as e:
        print(f"❌ Errore nel file {file_path}: {e}")

# 📌 Scansiona la cartella e processa ogni file JSON
for filename in os.listdir(FOLDER_PATH):
    if filename.endswith(".json"):  # Assicura di elaborare solo file JSON
        file_path = os.path.join(FOLDER_PATH, filename)
        convert_and_upload(file_path)

print("🎉 Conversione completata!")
