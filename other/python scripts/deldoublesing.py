import json
import spacy
from spacy.cli import download

import json
import spacy

def elimina_ripetizioni(input_file, output_file):
    """
    Legge un file JSON contenente una lista di oggetti con struttura [0] = nome, [1] = quantità,
    elimina le ripetizioni basandosi sul campo [0] e salva il risultato in un nuovo file JSON.
    
    :param input_file: Path al file JSON di input.
    :param output_file: Path al file JSON di output.
    """
    try:
        # Leggi il file JSON di input
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Usa un dizionario per eliminare duplicati basati sul campo [0] (nome)
        unique_data = {}
        for item in data:
            nome, quantita = item[0], item[1]
            # Aggiorna la quantità se il nome esiste già, altrimenti aggiungi
            if nome in unique_data:
                unique_data[nome] += quantita
            else:
                unique_data[nome] = quantita

        # Converti il dizionario in una lista di liste per il formato richiesto
        result = [[nome, quantita] for nome, quantita in unique_data.items()]

        # Scrivi il risultato nel file di output
        with open(output_file, 'w', encoding='utf-8') as file:
            json.dump(result, file, ensure_ascii=False, indent=4)

        print(f"File salvato con successo in: {output_file}")

    except Exception as e:
        print(f"Errore: {e}")

def rimuovi_quantita(input_file):
    """
    Rimuove il campo [1] (quantità) da ogni elemento del file JSON di input e salva le modifiche.
    
    :param input_file: Path al file JSON di input.
    """
    try:
        # Leggi il file JSON di input
        with open(input_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Rimuovi il campo quantità ([1]) da ogni elemento
        data_senza_quantita = [[item[0]] for item in data]

        # Sovrascrivi il file originale con i dati aggiornati
        with open(input_file, 'w', encoding='utf-8') as file:
            json.dump(data_senza_quantita, file, ensure_ascii=False, indent=4)

        print(f"Quantità rimosse e file sovrascritto: {input_file}")

    except Exception as e:
        print(f"Errore: {e}")

# Esempio di utilizzo
input_file = "../outputingredienti.json"  # Sostituisci con il path del file JSON di input
output_file = "../uniqingredienti.json"  # Sostituisci con il path del file JSON di output
rimuovi_quantita(output_file)
