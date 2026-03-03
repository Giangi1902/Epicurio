# Epicurio: Meal Recommendation & Planning

Epicurio è un'applicazione mobile innovativa progettata per rivoluzionare la gestione quotidiana dell'alimentazione. A differenza delle soluzioni esistenti, spesso limitate da interfacce poco intuitive o paywall, Epicurio integra in un'unica soluzione gratuita la pianificazione interattiva dei pasti, la gestione della dispensa e una lista della spesa dinamica.

## Caratteristiche principali
- **Pianificazione intelligente**: Suggerimento automatico dei pasti basato sugli ingredienti effettivamente disponibili in dispensa
- **Dispensa 2.0**: Monitoraggio in tempo reale delle scorte domestiche con suddivisione in categorie e ricerca avanzata
- **Lista della spesa dinamica**: Generazione automatica degli ingredienti mancanti basata sui pasti pianificati; una volta acquistati, i prodotti vengono trasferiti in dispensa con un tap
- **Gamification (Finder)**: Esplorazione di nuove ricette tramite un'interfaccia a scorrimento (swipe), dove le preferenze dell'utente influenzano i suggerimenti futuri
- **Notifiche push**: Promemoria personalizzati per ricordarti di iniziare la preparazione dei pasti in base agli orari impostati
- **Supporto offline**: Grazie all'uso di AsyncStorage, la lista della spesa rimane consultabile anche in assenza di connessione

## Stack tecnologico

| Componente | Tecnologia | Utilizzo |
| :--- | :--- | :--- |
| **```Frontend```** | ```React Native + Expo```| Sviluppo cross-platform per Androis e iOS |
| **```UI Framework```** | ```UI Kitten``` | Componenti visivi dal design moderno e personalizzabile |
| **```Backend```** | ```Node.js``` | Ambiente di esecuzione lato server per la gestione delle richieste |
| **```Database```** | ```MongoDB``` | Database NoSQL per la persistenza di utenti, pasti e ingredienti |

## Algoritmo di diversificazione

Il cuore di Epicurio è un algoritmo proprietario che evita la monotonia alimentare assegnando un punteggio $P_i$ a ogni ricetta: $$P_{i} = B_{i} + S_{i,u} + S_{i,g} - F_{i}$$

dove:
- $B_i$: Punteggio basato sul tempo trascorso dall'ultimo consumo (più tempo passa, più il punteggio sale)
- $S_{i,u}$: Valutazione soggettiva dell'utente specifico
- $S_{i,g}$: Media delle valutazioni globali della community
- $F_i$: Penalità (malus) applicata se il pasto è stato consumato troppo spesso di recente.

## Personalizzazione
L'applicazione supporta la personalizzazione estetica con quattro temi cromatici predefiniti (Verde, Blu, Viola, Rosso) selezionabili dal profilo utente per migliorare l'accessibilità e il comfort visivo.

