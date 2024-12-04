import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import time
import re 

def sanitize_filename(name):
    # Sostituisci caratteri non validi con un underscore
    return re.sub(r'[<>:"/\\|?*]', '_', name)

def scrape_categories_and_save(driver, base_url, output_folder):
    # Assicurati che la cartella di output esista
    os.makedirs(output_folder, exist_ok=True)

    # Apri il sito base
    driver.get(base_url)
    
    # Aspetta che la pagina si carichi
    time.sleep(5)
    
    # Trova tutte le categorie nella lista iniziale
    category_links = driver.find_elements(By.CSS_SELECTOR, 'ul.uk-list.category-list li a')
    
    for category_index in range(len(category_links)):
        # Ricarica gli elementi delle categorie dopo ogni navigazione
        category_links = driver.find_elements(By.CSS_SELECTOR, 'ul.uk-list.category-list li a')
        category_link = category_links[category_index]

        # Ottieni il nome della categoria per usarlo come nome file
        category_name = sanitize_filename(category_link.text.strip().replace(" ", "_"))
        output_file = os.path.join(output_folder, f"{category_name}.txt")
        
        # Clicca sulla categoria
        category_link.click()
        
        # Aspetta che la pagina della categoria si carichi
        time.sleep(5)
        
        # Inizia lo scraping dei prodotti per questa categoria
        with open(output_file, 'w', encoding='utf-8') as f:
            while True:
                # Analizza la pagina con BeautifulSoup
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                product_divs = soup.select('div.no-t-decoration.product-description.uk-position-relative')
                
                # Scrivi i titoli dei prodotti nel file
                for product_div in product_divs:
                    h3_tag = product_div.find('h3')
                    if h3_tag:
                        f.write(f"{h3_tag.get_text(strip=True)}\n")
                
                # Verifica se ci sono più pagine
                try:
                    next_page_button = driver.find_element(By.XPATH, '//a[@aria-label="Pagina Successiva"]')
                    if next_page_button:
                        next_page_button.click()
                        time.sleep(5)
                    else:
                        break
                except Exception:
                    print(f"Nessuna pagina successiva per la categoria {category_name}.")
                    break

        # Torna alla lista delle categorie per selezionare la prossima
        driver.get(base_url)
        time.sleep(5)

# Configura il driver di Selenium
options = webdriver.ChromeOptions()
options.add_argument("user-data-dir=C:\\Users\\giang\\AppData\\Local\\Google\\Chrome\\User Data")
options.add_argument("profile-directory=Default")
options.add_argument('--ignore-certificate-errors')
options.add_argument('--ignore-ssl-errors')
options.add_argument("--disable-notifications")
options.add_argument("--disable-infobars")
options.add_argument("--mute-audio")

driver = webdriver.Chrome(options=options)

# URL base del sito
base_url = "https://spesaonline.conad.it/c/integratori-alimentari--1901"

# Cartella di output
output_folder = "prodotti"

# Esegui lo scraping e salva i prodotti per ogni categoria
scrape_categories_and_save(driver, base_url, output_folder)

# Chiudi il driver
driver.quit()
