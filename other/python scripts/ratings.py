from pymongo import MongoClient

# Connessione al database MongoDB
client = MongoClient('mongodb+srv://gianludigia:4UFYjU0qGimW8oxq@myexpense.z5jz05w.mongodb.net/?retryWrites=true&w=majority&appName=MyExpense')
db = client['test']
collection = db['meals']

# Iteriamo su tutti i documenti che **non hanno il campo ratings**
documents_without_ratings = collection.find({"ratings": {"$exists": False}})

# Aggiorniamo ogni documento, aggiungendo il campo "ratings" con un array vuoto
for doc in documents_without_ratings:
    collection.update_one(
        {"_id": doc["_id"]}, 
        {"$set": {"ratings": []}}
    )
    print(f"Aggiunto 'ratings' al documento con _id: {doc['_id']}")

print("Aggiornamento completato!")
