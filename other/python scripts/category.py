import json

# Dizionario delle categorie con le parole chiave
categories = {
    "Preparazione": ["farina", "lievito", "alloro", "zucchero", "burro", "brodo", "semola", "menta", "sale", "grano", "olio", "frumento", "pane", "gelatina", "avena", "farine", "panini", "panino", "frumina", "alcol", "strutto", "margarina"],
    "Pasta e Riso": ["pasta", "sedanini", "torchietti", "cavatappi", "ziti", "gigli", "vermicelli", "stroncatura", "scialatielli", "canneroni", "tonnarelli", "penne", "lumaconi", "maccheroncini", "pappardelle", "trofie", "noodles", "pennoni", "troccoli", "strozzapreti", "cellentani", "paccherotti", "paccheri", "tubetti", "ditaloni", "farfalline", "filini", "rigati", "capellini", "riso", "lasagne", "ditalini", "fregola", "freselle", "fettuccine", "gnocchetti", "fusilloni", "rigatoni", "caccavelle", "lorighittas", "fusillotti", "farfalle", "spaghetti", "polenta", "conchiglioni", "fusilli", "casarecce", "spaghettoni", "tagliatelle", "couscous", "tortiglioni", "stelline", "radiatori", "friselle", "bucatini", "anelli", "bigoli", "bulgur", "semolino", "cannelloni"],
    "Carni": ["pollo", "manzo", "trippa", "mortadella", "guanciale", "cappone", "cavallo", "salame", "lumache", "colonnata", "faraona", "capretto", "verzini", "lampredotto", "lepre", "scottona", "lingua", "involtini", "galletto", "gallinella", "luganega", "speck", "capriolo", "bresaola", "cotechino", "caprino", "wurstel", "maiale", "salsiccia", "cinghiale", "salamella", "agnello", "vitello", "coniglio", "abbacchio", "quaglia", "tacchino", "anatra", "carne", "bovino", "bovina", "arista", "pecora", "capocollo", "prosciutto", "pancetta"],
    "Spezie": ["sale", "pepe", "senape", "paprika", "origano", "rosmarino", "basilico", "curcuma", "worcestershire", "salvia", "polvere", "eduli", "zafferano", "moscata"],
    "Latte e uova": ["latte", "formaggio", "pecorino", "stracchino", "fontina", "edamer", "robiola", "feta", "Caciocavallo silano", "tvorog", "vacherin", "camembert", "groviera", "tomini", "sbrinz", "quartirolo", "grana", "taleggio", "scamorza", "burrata", "skuta", "mozzarella", "yogurt", "burro", "panna", "ricotta", "asiago", "uova", "parmigiano", "tuorli", "albumi", "gorgonzola", "gamberi", "rospo", "nasello"],
    "Pesce": ["tonno", "salmone", "pesce", "cozze", "orata", "palamita", "seppioline", "pezzogna", "eglefino", "conchiglie", "triglie", "canocchie", "rombo", "ombrina", "fasolari", "sardine", "scampi", "ostriche", "seppie", "mare", "sogliola", "crostacei", "trota", "aringa", "mazzancolle", "granchio", "vongole", "linguine", "totani", "coregone", "ricciola", "scorfano", "calamarata", "merluzzo", "cernia", "gamberoni", "polpo", "sgombro", "gamberetti", "calamari", "polipetti", "sarde", "acciughe", "anguilla", "aragosta", "astice", "baccalà", "stoccafisso", "branzino"],
    "Frutta e verdura": ["albicocche", "lattuga", "pak", "marroni", "lime", "amaranto", "maggiorana", "portulaca", "cren", "lampascioni", "nespole", "cavoli", "lupini", "zenzero", "kumquat", "bruscandoli", "ortiche", "capperi", "porri", "arachide", "limoni", "sedano", "mirto", "mandarini", "carciofo", "rucola", "papaya", "insalata", "olive", "radicchio", "scarola", "rapa", "mirtilli", "mango", "friarielli", "cicoria", "crauti", "cetrioli", "finocchi", "lamponi", "more", "rabarbaro", "ribes", "susine", "cipolline", "clementine", "topinambur", "nocciole", "prugne", "sponsali", "verza", "catalogna", "cavoletti", "cavolfiore", "prezzemolo", "cardi", "fichi", "pistacchi", "arance", "ananas", "frutti", "fragole", "broccoli", "cavolo", "barbabietole", "cachi", "broccolo", "zucca", "zucchine", "noci", "pere", "uva", "fragola", "indivia", "melone", "pesche", "mele", "ciliegie", "castagne", "cocco", "banane", "avocado", "ravanelli", "cocomero", "mandorle", "pomodorini", "funghi", "pompelmi", "erba", "cipollina",  "pomodori", "rape", "asparagi", "edamame", "mela", "banana", "arancia", "limone", "kiwi", "pesca", "pera", "pomodoro", "carota", "cipolla", "zucchina", "peperone", "spinaci", "melanzana", "patata", "cipolle", "aglio", "carciofi"],
    "Dolci": ["miele", "cioccolato", "sciroppo", "caramello", "zucchero", "gelato", "cappuccino", "colomba", "codetta", "mascarpone", "tiramisu", "nutella", "crema", "meringhe", "pandoro", "biscotti", "torrone", "wafer", "cacao", "savoiardi", "pavesini", "confettura", "marmellata", "marmellate", "amaretti"],
    "Bevande": ["acqua", "sambuca", "vino", "birra", "succo", "caffè", "sidro", "te", "aperol", "bevanda", "campari", "prosecco", "tè", "vov", "vodka", "rum", "gin", "lambrusco", "whisky", "cachaca"],
    "Legumi": ["fagioli", "ceci", "lenticchie", "piselli", "soia", "fave", "cereali", "quinoa", "mais", "chia", "farro", "semi", "miglio", "orzo", "cicerchie"]
}

# Funzione che assegna la categoria in base al nome del prodotto
def assign_category(product_name):
    product_name = product_name.lower()  # Converti il nome del prodotto in minuscolo per facilitare la ricerca
    for category, keywords in categories.items():
        for keyword in keywords:
            if keyword in product_name:
                return category
    return "Altro"  # Categoria predefinita se nessuna parola chiave è trovata

# Funzione per caricare i dati da un file JSON, modificare le categorie e salvare nuovamente
def categorize_products(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as f:
        products = json.load(f)
    
    categorized_products = []
    
    # Per ogni prodotto, assegna una categoria e struttura i dati nel formato richiesto
    for product in products:
        product_name = product[0]  # Il nome del prodotto si trova alla posizione 0 nell'array
        category = assign_category(product_name)
        categorized_products.append({"nome": product_name, "categoria": category})
    
    # Salva i dati con la nuova categoria in un nuovo file
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(categorized_products, f, ensure_ascii=False, indent=4)

# Esegui il processo
input_file = "../uniqingredientigialloz.json"  # Sostituisci con il percorso del tuo file di input
output_file = "../categoryingredientgialloz.json"  # Sostituisci con il percorso del file di output
categorize_products(input_file, output_file)
