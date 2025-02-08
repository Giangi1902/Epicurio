import os
import json

# Percorso alla cartella contenente i file JSON
cartella_input = "../ricette"
# Nome del file di output
file_output = "../ingredientgialloz.json"

# Lista per memorizzare tutti gli ingredienti estratti
ingredienti_estratti = []

# Itera su tutti i file nella cartella
for nome_file in os.listdir(cartella_input):
    if nome_file.endswith(".json"):
        percorso_file = os.path.join(cartella_input, nome_file)
        
        # Leggi il file JSON
        with open(percorso_file, "r", encoding="utf-8") as file:
            try:
                dati = json.load(file)
                # Verifica che l'oggetto "ingredients" esista e sia una lista
                if "ingredients" in dati and isinstance(dati["ingredients"], list):
                    # Aggiungi tutti gli ingredienti alla lista
                    ingredienti_estratti.extend(dati["ingredients"])
            except json.JSONDecodeError:
                print(f"Errore nel decodificare il file: {nome_file}")

# Scrivi gli ingredienti estratti nel file di output
with open(file_output, "w", encoding="utf-8") as file:
    json.dump(ingredienti_estratti, file, indent=4, ensure_ascii=False)

print(f"Processo completato. Ingredienti estratti salvati in {file_output}.")