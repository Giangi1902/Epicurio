import json

def remove_duplicates_by_name(input_file, output_file):
    try:
        # Leggi il file JSON di input
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Verifica se il JSON è una lista
        if not isinstance(data, list):
            print("Errore: Il file JSON deve contenere una lista di oggetti.")
            return

        # Rimuove i duplicati usando un set per i valori del campo 'nome'
        unique_objects = []
        seen_names = set()
        
        for obj in data:
            nome = obj.get("nome")  # Prendi il campo 'nome'
            if nome and nome not in seen_names:
                seen_names.add(nome)  # Aggiungi il valore di 'nome' al set
                unique_objects.append(obj)  # Aggiungi l'oggetto alla lista finale
        
        # Scrivi i dati unici nel file di output
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(unique_objects, file, indent=4, ensure_ascii=False)
        
        print(f"Rimossi i duplicati (basati sul campo 'nome'): il risultato è stato salvato in '{output_file}'.")

    except FileNotFoundError:
        print(f"Errore: Il file '{input_file}' non esiste.")
    except json.JSONDecodeError:
        print(f"Errore: Il file '{input_file}' non è un JSON valido.")
    except Exception as e:
        print(f"Si è verificato un errore: {e}")

if __name__ == "__main__":
    # Specifica i file di input e output
    input_file = "../prodotti conad/allprod/merged_products.json"  # Inserisci il percorso del file di input
    output_file = "../prodotti conad/allprod/output_products.json" # Inserisci il percorso del file di output

    remove_duplicates_by_name(input_file, output_file)
