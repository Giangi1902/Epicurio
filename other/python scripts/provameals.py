import os
import json
from pymongo import MongoClient

# Percorso del file JSON
file_path = 'C:/Users/giang/Desktop/Informatica/Tesi/Epicurio/categoryingredients.json'

# Configurazione del client MongoDB
client = MongoClient('mongodb+srv://gianludigia:4UFYjU0qGimW8oxq@myexpense.z5jz05w.mongodb.net/?retryWrites=true&w=majority&appName=MyExpense')
db = client['test']
collection = db['ingredients']

# Controlla se il file esiste e aggiungilo al database
if os.path.isfile(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
            # Inserisce i dati nel database
            collection.insert_many(data if isinstance(data, list) else [data])
            print("File importato con successo!")
        except json.JSONDecodeError as e:
            print(f"Errore nella decodifica del file: {e}")
else:
    print("Il file specificato non esiste.")


# Per inserire piu file di una cartella in un unica collezione
# import os
# import json
# from pymongo import MongoClient

# # Percorso della cartella contenente i file JSON
# folder_path = 'C:/Users/giang/Desktop/Informatica/Tesi/Epicurio/ricette'

# # Configurazione del client MongoDB
# client = MongoClient('mongodb+srv://gianludigia:4UFYjU0qGimW8oxq@myexpense.z5jz05w.mongodb.net/?retryWrites=true&w=majority&appName=MyExpense')
# db = client['test']
# collection = db['menu']

# # Itera attraverso tutti i file nella cartella
# for file_name in os.listdir(folder_path):
#     if file_name.endswith('.json'):
#         file_path = os.path.join(folder_path, file_name)
#         with open(file_path, 'r', encoding='utf-8') as f:
#             try:
#                 # Legge il contenuto del file JSON
#                 data = json.load(f)

#                 # Inserisce il documento nella collezione
#                 collection.insert_one(data)
#                 print(f"File {file_name} importato con successo.")
#             except json.JSONDecodeError as e:
#                 print(f"Errore nella decodifica del file {file_name}: {e}")

# print("Tutti i file sono stati importati con successo!")
