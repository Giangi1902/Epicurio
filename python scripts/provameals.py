import os
import json
from pymongo import MongoClient

folder_path = 'C:/Users/giang/Desktop/Informatica/Tesi/Epicurio/prodotti conad/allprod'
client = MongoClient('mongodb+srv://gianludigia:4UFYjU0qGimW8oxq@myexpense.z5jz05w.mongodb.net/?retryWrites=true&w=majority&appName=MyExpense')
db = client['test']
collection = db['ingredients']

for file_name in os.listdir(folder_path):
    if file_name.endswith('.json'):
        with open(os.path.join(folder_path, file_name), 'r') as f:
            data = json.load(f)
            collection.insert_many(data if isinstance(data, list) else [data])

print("All files imported successfully!")
