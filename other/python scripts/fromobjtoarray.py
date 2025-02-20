import os
import json

def convert_details_to_array(json_data):
    if "details" in json_data and isinstance(json_data["details"], dict):
        json_data["details"] = [{"label": k, "value": v} for k, v in json_data["details"].items()]
    return json_data

def process_json_files(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".json"):  # Controlla che il file sia un JSON
            file_path = os.path.join(directory, filename)
            
            with open(file_path, "r", encoding="utf-8") as file:
                try:
                    data = json.load(file)
                    updated_data = convert_details_to_array(data)
                    
                    # Scrive il file con la nuova struttura
                    with open(file_path, "w", encoding="utf-8") as updated_file:
                        json.dump(updated_data, updated_file, indent=4, ensure_ascii=False)
                    print(f"File aggiornato: {filename}")
                except json.JSONDecodeError:
                    print(f"Errore nel leggere il file: {filename}")

# Specifica la cartella contenente i file JSON
directory_path = "../zzz/Recipes"  # Cambia con il percorso della tua cartella
process_json_files(directory_path)
