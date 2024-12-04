from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Impostazioni delle opzioni di Chrome
options = webdriver.ChromeOptions()

# Aggiungi il percorso del tuo profilo di Chrome predefinito
options.add_argument("user-data-dir=C:\\Users\\giang\\AppData\\Local\\Google\\Chrome\\User Data")
options.add_argument("profile-directory=Default")  # Usa il profilo 'Default'

options.add_argument("--start-maximized")  # Avvia Chrome a schermo intero
options.add_argument("--no-sandbox")  # Disabilita la sandbox per evitare problemi su alcuni sistemi
options.add_argument("--disable-dev-shm-usage")  # Disabilita l'uso di dev/shm per risolvere alcuni errori
options.add_argument("--remote-debugging-port=9222")  # Aggiungi questa riga per risolvere il problema di connessione

# Imposta il servizio per ChromeDriver
service = Service(ChromeDriverManager().install())

# Crea un'istanza di Chrome con il servizio e le opzioni
driver = webdriver.Chrome(service=service, options=options)

# Apre una pagina web
driver.get("https://www.google.com")

# Lascia aperta la pagina per 10 secondi
input("Premi Invio per chiudere il browser...")

# Chiude il browser
driver.quit()
