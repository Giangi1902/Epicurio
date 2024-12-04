import colorsys

# Converti un colore HEX in RGB
def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

# Converti un colore RGB in HEX
def rgb_to_hex(rgb):
    return "#{:02x}{:02x}{:02x}".format(max(0, min(255, rgb[0])),
                                        max(0, min(255, rgb[1])),
                                        max(0, min(255, rgb[2])))

# Cambia la tonalità di un colore mantenendo la saturazione e la luminosità
def shift_hue(rgb, new_hue):
    # Converti RGB (0-255) a HLS (0-1)
    r, g, b = [x / 255.0 for x in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    # Imposta una nuova tonalità
    h = new_hue
    # Converti di nuovo a RGB
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return int(r * 255), int(g * 255), int(b * 255)

# Genera una nuova palette basata su una tonalità di base
def generate_palette(base_colors, base_hue):
    palette = []
    for color in base_colors:
        rgb = hex_to_rgb(color)
        # Calcola la tonalità di base dell'originale
        r, g, b = [x / 255.0 for x in rgb]
        original_hue, l, s = colorsys.rgb_to_hls(r, g, b)
        # Cambia solo la tonalità (Hue)
        new_rgb = shift_hue(rgb, base_hue)
        palette.append(rgb_to_hex(new_rgb))
    return palette

# Colori base della palette originale
base_colors = ["#FFFFFF", "#ADC8C8", "#097373", "#052424"]

# Tonalità (Hue) per nuove palette (rosso, lilla, ecc.)
# I valori di tonalità vanno da 0 a 1: 0 è rosso, 0.33 è verde, 0.66 è blu.
target_hues = {
    "rosso": 0.0,
    "lilla": 0.83,
    "verde": 0.33,
    "blu": 0.66,
    "giallo": 0.17
}

# Genera e stampa le palette per ogni tonalità
for name, hue in target_hues.items():
    new_palette = generate_palette(base_colors, hue)
    print(f"Palette {name.capitalize()}: {new_palette}")



# Palette Rosso: ['#ffffff', '#c8adad', '#730808', '#240404']
# Palette Lilla: ['#ffffff', '#c7adc8', '#700873', '#230424']
# Palette Verde: ['#ffffff', '#adc8ad', '#0b7308', '#052404']
# Palette Blu: ['#ffffff', '#adaec8', '#080d73', '#040624']
# Palette Giallo: ['#ffffff', '#c7c8ad', '#707308', '#232404']

