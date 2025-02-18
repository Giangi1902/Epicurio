//Importo il modulo express e creo un nuovo router
const axios = require('axios');
const express = require('express');
const router = express.Router();
const cron = require('node-cron');
//Importo User e Post da userDetails, i quali rappresentano i dettagli degli utenti e dei post
const { User, Ingredient, Meal, Pantry, Daily } = require('../serverDetails');

//Funzione per prendere tutti i prodotti all'interno della lista della spesa di un determinato utente
router.get("/getIngredients/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        const idUser = user.id
        console.log(idUser)
        if (user) {
            const lista = user.checklist
            let ingredientsInfo = []
            for (const ingredient of lista) {
                const idIngredient = ingredient[0]
                const categoryIngredient = ingredient[1]
                const checkboxIngredient = ingredient[2]
                const ingrediente = await Ingredient.findOne({ _id: idIngredient })
                const nameIngredient = ingrediente.nome

                ingredientsInfo.push({
                    id: idIngredient,
                    category: categoryIngredient,
                    name: nameIngredient,
                    checkbox: checkboxIngredient
                })

            }
            res.json(ingredientsInfo);
        }
    }
    catch (e) {
        console.log(e);
    }
});

// router.get("/getCosts/:username", async (req, res) => {
//     const { username } = req.params;
//     try {
//         const exist = await User.findOne({ username: username });
//         if (exist) {
//             let prices = [];
//             for (const ingrediente of exist.ingredienti) {
//                 const market = exist.market.toLowerCase();
//                 const ingredient = await Ingredient.findById(ingrediente.id);
//                 const price = ingredient[market];
//                 prices.push({
//                     id: ingredient._id,
//                     cost: price
//                 });
//             }
//             res.json(prices);
//         }
//     }
//     catch (e) {
//         console.log(e);
//     }
// });


//TODO: pesi cambiabili per utente
// Funzione per calcolare il punteggio per pasto
//TODO: ricontrollare bene la funzione
async function calcolaPunteggiUtente(userId, meals) {
    try {
        // pasti degli ultimi 5 giorni
        const oggi = new Date();
        const inizioIntervallo = new Date(oggi);
        inizioIntervallo.setDate(oggi.getDate() - 5);

        const programmazione = await Daily.find({
            idUtente: userId,
            data: { $gte: inizioIntervallo.toISOString(), $lte: oggi.toISOString() }
        }).populate('pasti.colazione pasti.pranzo pasti.cena');

        // Calcola le frequenze e gli ultimi utilizzi
        const frequenze = {};
        const ultimiUtilizzi = {};

        programmazione.forEach((sched) => {
            console.log("fuori")
            const { colazione, pranzo, cena, data } = sched.pasti;

            [colazione, pranzo, cena].forEach((pasto) => {
                console.log("dentro")
                if (pasto) {
                    console.log("dentroif")
                    const pastoId = pasto._id.toString();
                    console.log(pastoId)
                    const dataPasto = new Date(sched.data);

                    // Calcola i giorni di distanza
                    const giorniDiDistanza = Math.floor((oggi - dataPasto) / (1000 * 60 * 60 * 24));

                    let malus = 0;
                    if (giorniDiDistanza === 0) {
                        malus = 2.5;
                    } else if (giorniDiDistanza === 1) {
                        malus = 1.25;
                    } else if (giorniDiDistanza === 2) {
                        malus = 0.625;
                    } else if (giorniDiDistanza === 3 || giorniDiDistanza === 4) {
                        malus = 0.3125;
                    }
                    frequenze[pastoId] = (frequenze[pastoId] || 0) + malus;

                    // Aggiorna ultimo utilizzo
                    if (!ultimiUtilizzi[pastoId] || dataPasto > ultimiUtilizzi[pastoId]) {
                        ultimiUtilizzi[pastoId] = dataPasto;
                    }
                }
            });
        });

        // Calcolo del punteggio
        const PESO_ULTIMO_UTILIZZO = 0.45;
        const PESO_VALUTAZIONE_UTENTE = 0.45;
        const PESO_VALUTAZIONE_GLOBALE = 0.10;

        const punteggiRicette = meals.map((meal) => {
            const mealId = meal._id.toString();

            // Bonus tempo: 1 punto per ogni giorno dall'ultimo utilizzo
            const ultimoUtilizzo = ultimiUtilizzi[mealId];
            const giorniDalUltimoUtilizzo = ultimoUtilizzo
                ? Math.floor((oggi - ultimoUtilizzo) / (1000 * 60 * 60 * 24))
                : 5;
            const bonusTempo = giorniDalUltimoUtilizzo * PESO_ULTIMO_UTILIZZO;

            // Valutazione dell'utente
            const valutazioneUtenteObj = meal.ratings.find((rating) => rating.idUtente.toString() === userId.toString());
            const valutazioneUtente = valutazioneUtenteObj ? valutazioneUtenteObj.valutazione : 0;
            const punteggioValutazioneUtente = valutazioneUtente * PESO_VALUTAZIONE_UTENTE;

            // Valutazione globale
            const valutazioniGlobali = meal.ratings.length > 0
                ? meal.ratings.reduce((sum, rating) => sum + rating.valutazione, 0) / meal.ratings.length
                : 0;
            const punteggioValutazioneGlobale = valutazioniGlobali * PESO_VALUTAZIONE_GLOBALE;

            // Frequenza (malus)
            const frequenza = frequenze[mealId] || 0;

            // Punteggio totale
            const punteggioTotale = (
                bonusTempo +
                punteggioValutazioneUtente +
                punteggioValutazioneGlobale -
                frequenza
            );

            return {
                title: meal.title,
                punteggio: punteggioTotale,
                punteggioValutazioneUtente,
                punteggioValutazioneGlobale,
                bonusTempo,
                malusFrequenza: frequenza
            };
        });

        // Ordina le ricette per punteggio (decrescente)
        punteggiRicette.sort((a, b) => b.punteggio - a.punteggio);

        return punteggiRicette;
    } catch (error) {
        console.error("Errore nel calcolo dei punteggi:", error);
        throw error;
    }
}

async function estraiPastiPesati(punteggiRicette, numeroPasti = 5) {
    try {
        // Tratta i punteggi negativi come 0
        const punteggiCorretti = punteggiRicette.map((ricetta) => ({
            ...ricetta,
            punteggio: ricetta.punteggio < 0 ? 0 : ricetta.punteggio
        }));

        // Calcola il totale dei punteggi
        const totalePunteggi = punteggiCorretti.reduce((acc, ricetta) => acc + ricetta.punteggio, 0);

        // Se il totale è 0 (tutti i punteggi sono negativi o 0), assegna probabilità uguali
        if (totalePunteggi === 0) {
            console.warn("Tutti i punteggi sono 0 o negativi. Assegno probabilità uguali.");
            return punteggiCorretti.map((ricetta) => ({
                ...ricetta,
                probabilita: 1 / punteggiCorretti.length
            }));
        }

        // Se il punteggio è negativo allora ha probabilità 0
        const ricetteConProbabilita = punteggiCorretti.map((ricetta) => ({
            ...ricetta,
            probabilita: ricetta.punteggio / totalePunteggi
        }));

        // Trova la probabilità più bassa calcolata
        const probabilitaMinima = Math.min(
            ...ricetteConProbabilita.filter((ricetta) => ricetta.probabilita > 0).map((ricetta) => ricetta.probabilita)
        );

        // Assegna la probabilità minima ai punteggi 0
        ricetteConProbabilita.forEach((ricetta) => {
            if (ricetta.punteggio === 0) {
                ricetta.probabilita = probabilitaMinima;
            }
        });

        // Raggruppa piatti per probabilità unica
        const raggruppamentoProbabilita = {};
        ricetteConProbabilita.forEach((ricetta) => {
            const prob = ricetta.probabilita;
            if (!raggruppamentoProbabilita[prob]) {
                raggruppamentoProbabilita[prob] = [];
            }
            raggruppamentoProbabilita[prob].push({
                title: ricetta.title,
                punteggio: ricetta.punteggio
            });
        });

        // Visualizza il raggruppamento
        // console.log("Raggruppamento probabilità e punteggi:", raggruppamentoProbabilita);

        // Estrai pasti randomicamente basandoti sulle probabilità pesate
        const pastiEstratti = [];
        while (pastiEstratti.length < numeroPasti && ricetteConProbabilita.length > 0) {
            const random = Math.random();
            let accumulatore = 0;

            for (let i = 0; i < ricetteConProbabilita.length; i++) {
                accumulatore += ricetteConProbabilita[i].probabilita;
                if (random <= accumulatore) {
                    pastiEstratti.push(ricetteConProbabilita[i]);
                    ricetteConProbabilita.splice(i, 1); // Rimuovi la ricetta estratta
                    break;
                }
            }
        }

        return pastiEstratti;
    } catch (error) {
        console.error("Errore durante l'estrazione dei pasti pesati:", error);
        throw error;
    }
}

// Funzione per trovare ricette realizzabili con gli ingredienti della dispensa: ok
async function mealsByPantry(userId) {
    try {
        // Trova la dispensa dell'utente
        const pantry = await Pantry.findOne({ idUtente: userId });

        if (!pantry || !pantry.idIngredienti.length) {
            return []; // Se la dispensa non esiste o è vuota, restituisci un array vuoto
        }

        // Ottieni i nomi degli ingredienti iterando sugli ID
        const ingredientNames = [];
        for (const id of pantry.idIngredienti) {
            const ingredient = await Ingredient.findById(id);
            if (ingredient) {
                ingredientNames.push(ingredient.nome);
            }
        }

        // Crea un Set con i nomi degli ingredienti disponibili per una ricerca più efficiente
        const availableIngredients = new Set(ingredientNames);

        // Recupera tutte le ricette dal database
        const recipes = await Meal.find();

        // Filtra le ricette per tenere solo quelle che possono essere realizzate con gli ingredienti disponibili
        const availableRecipes = recipes.filter(recipe => {
            return recipe.ingredients.every(ingredient => availableIngredients.has(ingredient[0]));
        });

        return availableRecipes;
    } catch (error) {
        console.error("Errore nel recupero delle ricette:", error);
        return [];
    }
}

// Funzione per ottenere i nomi degli ingredienti
async function getIngredients(userId) {
    try {
        // Trova la dispensa dell'utente
        const pantry = await Pantry.findOne({ idUtente: userId });

        if (!pantry || !pantry.idIngredienti.length) {
            return []; // Se la dispensa non esiste o è vuota, restituisci un array vuoto
        }

        const nomeIngredienti = [];

        // Itera sugli ID degli ingredienti e cerca il nome in Ingredient
        for (const idIngredient of pantry.idIngredienti) {
            const ingredient = await Ingredient.findById(idIngredient);
            if (ingredient) {
                nomeIngredienti.push(ingredient.nome);
            }
        }

        return nomeIngredienti;
    } catch (error) {
        console.error("Errore nel recupero degli ingredienti:", error);
        return [];
    }
}

router.get("/createSchedule/:username", async (req, res) => {
    const { username } = req.params;
    try {
        // console.log("partita")
        const user = await User.findOne({ username: username });
        // const punteggiRicette = await calcolaPunteggiUtente(user.id)
        // const pastiPesati = await estraiPastiPesati(punteggiRicette, 5);
        // console.log(pastiPesati)
        const response = await mealsByPantry(user.id)
        const pastipesati = await calcolaPunteggiUtente(user.id, response)
        // const pastiestratti = await estraiPastiPesati(pastipesati, 5)
        // console.log(pastiestratti)
        res.json
    }
    catch (e) {
        console.log(e)
    }
})

router.get("/getAllIngredients/:index", async (req, res) => {
    const { index } = req.params;

    try {
        // Trova tutti gli ingredienti
        const ingredients = await Ingredient.find();

        // Filtra gli ingredienti escludendo le categorie specifiche
        const filteredIngredients = ingredients.filter(ingredient =>
            ingredient.categoria !== "prodotti per animali" &&
            ingredient.categoria !== "articoli per la casa" &&
            ingredient.categoria !== "cura personale"
        );

        filteredIngredients.sort((a, b) => a.nome.localeCompare(b.nome));

        // Applica la paginazione
        const startIndex = parseInt(index) * 25;
        const endIndex = startIndex + 25;
        const chunkedArray = filteredIngredients.slice(startIndex, endIndex);

        // Restituisci gli elementi filtrati e paginati
        res.json(chunkedArray);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/addIngredients", async (req, res) => {
    const { username, quantities } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            for (const ingredient of quantities) {
                const id = ingredient.id;
                const quantity = parseInt(ingredient.quantity);
                const existingIngredientIndex = user.ingredienti.findIndex(item => item.id === id);

                if (existingIngredientIndex !== -1) {
                    await User.updateOne({ username: username, 'ingredienti.id': id }, { $inc: { 'ingredienti.$.quantity': quantity } });
                }
                else {
                    user.ingredienti.push({ id: id, quantity: quantity });
                }
            }
            await user.save();
            res.json("ok");
        }
    }
    catch (e) {
        console.log(e);
    }
});

router.get("/getCards", async (req, res) => {
    try {
        //solo 15 ricette
        const response = await Meal.find().limit(15)
        res.json(response)
    }
    catch (e) {
        console.log(e)
    }
})

router.get("/getMeals/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        const pasti = await Daily.find({ idUtente: user.id })
        const results = [];
        for (const pasto of pasti) {
            let pranzo = []
            let cena = []
            if (pasto.pasti.pranzo != null) {
                const idPranzo = pasto.pasti.pranzo.toString()
                pranzo = await Meal.findOne({ _id: idPranzo })
            }
            if (pasto.pasti.cena != null) {
                const idCena = pasto.pasti.cena.toString()
                cena = await Meal.findOne({
                    _id: idCena
                })
            }
            results.push({
                userId: pasto.idUtente,
                data: pasto.data,
                pranzo: pranzo ? pranzo.title : null,
                cena: cena ? cena.title : null
            });
        }
        res.json(results)
    }
    catch (e) {
        console.log(e)
    }
})

router.post("/updateIngredientFromChecklist/:username", async (req, res) => {
    const { username } = req.params;
    const { updatedQuantities } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (user) {
            for (const ingredient of updatedQuantities) {
                const id = ingredient.id;
                const quantity = ingredient.quantity;

                if (quantity === 0) {
                    await User.findOneAndUpdate({ username: username }, { $pull: { ingredienti: { id: id } } });
                }
                else {
                    await User.findOneAndUpdate({ username: username, 'ingredienti.id': id }, { 'ingredienti.$.quantity': quantity });
                }
            }
            res.json("ok");
        } else {
            res.json("no");
        }
    } catch (e) {
        console.log(e);
    }
});


router.post("/updateCheckbox/:username/:ingredientId", async (req, res) => {
    const { username, ingredientId } = req.params;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            const ingredient = user.ingredienti.find(ingredient => ingredient.id === ingredientId);
            if (ingredient) {
                await User.findOneAndUpdate({ username: username, 'ingredienti.id': ingredientId }, { $set: { 'ingredienti.$.checked': !ingredient.checked } });
                res.json("ok")
            }
            else {
                res.json("no");
            }
        }
    } catch (error) {
        console.log("error");
    }
});

router.post("/addIngredientDispensa/:username", async (req, res) => {
    const { username } = req.params;
    let { ingredients } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (user) {
            for (const ingrediente of ingredients) {
                if (ingrediente.checked === true) {
                    const existingIngredientIndex = user.dispensa.findIndex(item => item.id === ingrediente.id);
                    if (existingIngredientIndex !== -1) {
                        await User.updateOne({ username: username, 'dispensa.id': ingrediente.id }, { $inc: { 'dispensa.$.quantity': ingrediente.quantity } })
                    } else {
                        user.dispensa.push({ id: ingrediente.id, quantity: ingrediente.quantity });
                    }
                    ingredients = ingredients.filter(item => item.id !== ingrediente.id);
                    await user.updateOne({ $pull: { 'ingredienti': { id: ingrediente.id } } });
                }
            }
            await user.save();
            res.json(ingredients);
        }
        else {
            res.json("no")
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getDispensa/:username", async (req, res) => {
    const { username } = req.params
    try {
        const user = await User.findOne({ username: username })
        if (user) {
            const pantryUser = await Pantry.findOne({ _id: idUser });
            const pantryIngredient = pantryUser.idIngredienti       //problema se non c'è niente in dispensa 
            let ingredientsInfo = []
            for (const ingredient of pantryIngredient) {
                const idIngredient = ingredient[0]
                const quantityIngredient = ingredient[1]
                const availableIngredient = ingredient[2]
                const ingrediente = await Ingredient.findOne({ _id: idIngredient })
                const nameIngredient = ingrediente.nome
                const categoryIngredient = ingrediente.categoria

                ingredientsInfo.push({
                    id: idIngredient,
                    quantity: quantityIngredient,
                    nome: nameIngredient,
                    category: categoryIngredient,
                    available: availableIngredient
                })
            }
            // ingredientsInfo.sort((a, b) => (a.category > b.category) ? 1 : ((b.category > a.category) ? -1 : 0));
            res.json(ingredientsInfo);
        }
        else {
            res.json("no")
        }
    }
    catch (e) {
        console.log(e)
    }
})

router.get("/categoryIngredients/:username/:categoria", async (req, res) => {
    const { username, categoria } = req.params
    try {
        const user = await User.findOne({ username: username })
        if (user) {
            //confrontarlo con la collezione ingredienti
            //prendere solo quelli della categoria
            //ritornare come primi gli ingredienti che ha in dispensa e poi quelli che non ha
            const pantryUser = await Pantry.findOne({ idUtente: user.id });
            const ingredientIds = pantryUser.idIngredienti;
            const ingredientsInPantry = await Ingredient.find({
                _id: { $in: ingredientIds },
                categoria: new RegExp(`^${categoria}$`, "i")
            });
            res.json(ingredientsInPantry)
        }
    }
    catch (e) {
        console.log(e)
    }
})

router.get("/getMeals/:username", async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ success: false, message: "Utente non trovato" });
        }
        const weekDays = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'];
        const mealsByDay = {};
        for (const day of weekDays) {
            const mealIds = user[day]; // Assume che user[day] sia un array con [pranzo, cena]

            mealsByDay[day] = await Promise.all(mealIds.map(async (mealId, index) => {
                if (mealId !== '') {
                    const meal = await Meal.findById(mealId).select('-images'); // Escludi il campo images
                    return {
                        orario: index === 0 ? 'pranzo' : 'cena',
                        meal
                    };
                } else {
                    return {
                        orario: index === 0 ? 'pranzo' : 'cena',
                        meal: null
                    };
                }
            }));
        }

        // Rimuovi i valori nulli dal risultato finale mantenendo la struttura {pranzo, cena}
        for (const day in mealsByDay) {
            const dayMeals = {
                pranzo: null,
                cena: null
            };
            mealsByDay[day].forEach(mealObj => {
                if (mealObj.orario === 'pranzo') {
                    dayMeals.pranzo = mealObj.meal;
                } else if (mealObj.orario === 'cena') {
                    dayMeals.cena = mealObj.meal;
                }
            });
            mealsByDay[day] = dayMeals;
        }
        res.json({ success: true, data: mealsByDay });
    } catch (error) {
        console.log("error");
        res.status(500).json({ success: false, message: "Errore durante il recupero dei pasti" });
    }
});

router.get("/getPhotos/:item", async (req, res) => {
    const { item } = req.params
    try {
        const pasto = await Meal.findOne({ nome: item })
        res.json(pasto.images)
    }
    catch (e) {
        console.log(e)
    }
})

router.delete("/deleteMeal/:username", async (req, res) => {
    const { username } = req.params;
    const mealId = req.body.mealId;
    const orario = req.body.orario
    const giorno = mealId.giorno.toLowerCase()
    let type;
    if (orario == "pranzo") {
        type = 0
    }
    else {
        type = 1
    }
    try {
        const user = await User.findOne({ username: username });
        user[giorno][type] = ''
        await user.save()
        res.status(200).json({ message: "Pasto eliminato con successo" });
    } catch (error) {
        console.log("error");
        res.status(500).json({ error: "Si è verificato un errore durante l'eliminazione del pasto" });
    }
});

router.post("/sendReview/:rating", async (req, res) => {
    const { rating } = req.params;
    const { photo, dish } = req.body;

    try {
        const meal = await Meal.findOne({ _id: dish });

        if (!meal) {
            return res.status(404).json({ message: "Meal not found" });
        }

        // Aggiungi la foto alla lista delle immagini
        if (photo) {
            meal.images.push(photo);
        }

        // Aggiorna il numero totale di valutazioni e la valutazione media
        const totalRatings = meal.raters * meal.rating + parseInt(rating);
        meal.raters += 1;
        meal.rating = totalRatings / meal.raters;

        await meal.save();
        res.json("ok");
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/getNextMeal/:currentDay/:username", async (req, res) => {
    const { currentDay, username } = req.params;
    try {
        const user = await User.findOne({ username: username });
        const mealIds = user[currentDay];
        const meals = await Promise.all(mealIds.map(async (mealId) => {
            if (mealId !== '') {
                const meal = await Meal.findById(mealId).select('-images -description -banned -icon -raters'); // Esclude il campo 'images'
                return meal;
            } else {
                return null;
            }
        }));

        const responseMeals = {
            pranzo: meals[0],
            cena: meals[1]
        };

        res.json(responseMeals);
    } catch (error) {
        console.log("errore");
        res.status(500).json({ success: false, message: "Errore durante il recupero dei pasti" });
    }
});

router.get("/getAllMeals/:username", async (req, res) => {
    try {
        const meals = await Meal.find().select('-images -description -banned -icon -raters');
        res.json(meals);
    } catch (error) {
        console.log("error");
        res.status(500).json({ success: false, message: "Errore durante il recupero dei pasti" });
    }
});

router.post("/changeMeal", async (req, res) => {
    const { id, username, orario, day } = req.body;

    try {
        const user = await User.findOne({ username: username });

        // Associa orario a 0 (pranzo) o 1 (cena)
        const mealIndex = orario === 'pranzo' ? 0 : 1;

        // Aggiorna l'id del piatto per il giorno e orario specificati
        user[day][mealIndex] = id;

        // Salva le modifiche
        await user.save();

        res.json("ok");
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Internal server error" });
    }
});


//TODO: gestire bene gli errori nella creazione del nuovo menu
router.post("/newMenu", async (req, res) => {
    const { username, selectedMeals, budget } = req.body;
    let budgetfromfe = budget
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ error: "Utente non trovato" });
        }

        const dispensa = user.dispensa;
        const ingredientIds = dispensa.map(item => item.id);
        const ingredientsAll = await Ingredient.find()
        const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } });

        // Creare una nuova dispensa con i nomi degli ingredienti
        const newDispensa = dispensa.map(item => {
            const ingredient = ingredients.find(ing => ing._id.equals(item.id));
            if (ingredient) {
                return {
                    nome: ingredient.nome,
                    quantity: item.quantity,
                    id: item.id
                };
            }
            return null;
        }).filter(item => item !== null);

        // Recuperare tutti i pasti con solo i campi _id, ingredients, e price
        const meals = await Meal.find({}, '_id ingredients price nome');
        const simplifiedMeals = meals.map(meal => ({
            _id: meal._id.toString(),
            ingredients: meal.ingredients,
            price: meal.price,
            nome: meal.nome
        }));

        // Ordinare i pasti dal prezzo minore al maggiore
        simplifiedMeals.sort((a, b) => a.price - b.price);

        // Controlla quali piatti possono essere preparati ma non fa lo stesso per piu volte, solo una iterazione
        const possibleMeals = simplifiedMeals.filter(meal => {
            return meal.ingredients.every(ingredient => {
                return newDispensa.some(disp => disp.nome === ingredient && disp.quantity > 0);
            });
        });

        //assegna il pasto al giorno e diminuisce la quantita degli ingredienti in dispensa
        selectedMeals.forEach((item, index) => {
            if (item.pranzo && item.cena) {
                // Assegna il pasto per il pranzo
                if (index < possibleMeals.length) {
                    user[item.day][0] = possibleMeals[index]._id;
                    possibleMeals[index].ingredients.forEach(ingredient => {
                        const dispItemIndex = newDispensa.findIndex(disp => disp.nome === ingredient);
                        if (dispItemIndex !== -1 && newDispensa[dispItemIndex].quantity > 0) {
                            newDispensa[dispItemIndex].quantity--;
                        }
                    });
                    item.pranzo = false;
                }

                // Assegna il pasto per la cena
                if (index + 1 < possibleMeals.length) { // Verifica che ci sia un altro pasto disponibile
                    user[item.day][1] = possibleMeals[index + 1]._id;
                    possibleMeals[index + 1].ingredients.forEach(ingredient => {
                        const dispItemIndex = newDispensa.findIndex(disp => disp.nome === ingredient);
                        if (dispItemIndex !== -1 && newDispensa[dispItemIndex].quantity > 0) {
                            newDispensa[dispItemIndex].quantity--;
                        }
                    });
                    item.cena = false;
                }
            } else {
                const mealIndex = item.pranzo ? 0 : 1;
                if (index < possibleMeals.length) {
                    user[item.day][mealIndex] = possibleMeals[index]._id;
                    possibleMeals[index].ingredients.forEach(ingredient => {
                        const dispItemIndex = newDispensa.findIndex(disp => disp.nome === ingredient);
                        if (dispItemIndex !== -1 && newDispensa[dispItemIndex].quantity > 0) {
                            newDispensa[dispItemIndex].quantity--;
                        }
                    });
                }
            }
        });

        //aggiorno la dispensa togliendo gli ingredienti utilizzati per creare la settimana
        user.dispensa = newDispensa
        let remainingMeals = selectedMeals.filter(item => item.pranzo || item.cena);
        const newIngredients = user.ingredienti
        async function AddMeal(remainingMeals) {
            for (let item of remainingMeals) {
                if (item.pranzo) {
                    const mealIndex = simplifiedMeals.findIndex(meal => meal.price <= budgetfromfe);
                    if (mealIndex !== -1) {
                        user[item.day][0] = simplifiedMeals[mealIndex]._id;
                        budgetfromfe -= simplifiedMeals[mealIndex].price; // Detrarre il costo del pasto dal budgetfromfe

                        // Aggiungere gli ingredienti a user.ingredienti
                        for (const ingredientName of simplifiedMeals[mealIndex].ingredients) {
                            const ingredient = ingredientsAll.find(ing => ing.nome === ingredientName);
                            if (ingredient) {
                                let found = false;
                                for (let i = 0; i < newIngredients.length; i++) {
                                    if (newIngredients[i].id === ingredient._id.toString()) {
                                        // Se l'ingrediente esiste, incrementa la quantità
                                        newIngredients[i].quantity += 1;
                                        await User.findOneAndUpdate({ username: username, "ingredienti.id": ingredient._id.toString() }, { $inc: { "ingredienti.$.quantity": 1 } })
                                        found = true;
                                        break;
                                    }
                                }

                                if (!found) {
                                    newIngredients.push({
                                        id: ingredient._id.toString(),
                                        quantity: 1
                                    });
                                }
                            }
                        }
                        simplifiedMeals.splice(mealIndex, 1); // Rimuove il pasto assegnato dalla lista
                        item.pranzo = false; // Imposta pranzo a false
                    }
                }
                if (item.cena) {
                    const mealIndex = simplifiedMeals.findIndex(meal => meal.price <= budgetfromfe);
                    if (mealIndex !== -1) {
                        user[item.day][1] = simplifiedMeals[mealIndex]._id;
                        budgetfromfe -= simplifiedMeals[mealIndex].price; // Detrarre il costo del pasto dal budget

                        // Aggiungere gli ingredienti a user.ingredienti
                        for (const ingredientName of simplifiedMeals[mealIndex].ingredients) {
                            const ingredient = ingredientsAll.find(ing => ing.nome === ingredientName);
                            if (ingredient) {
                                let found = false;
                                for (let i = 0; i < newIngredients.length; i++) {
                                    if (newIngredients[i].id === ingredient._id.toString()) {
                                        // Se l'ingrediente esiste, incrementa la quantità
                                        newIngredients[i].quantity += 1;
                                        await User.findOneAndUpdate({ username: username, "ingredienti.id": ingredient._id.toString() }, { $inc: { "ingredienti.$.quantity": 1 } })
                                        found = true;
                                        break;
                                    }
                                }

                                if (!found) {
                                    newIngredients.push({
                                        id: ingredient._id.toString(),
                                        quantity: 1
                                    });
                                }
                            }
                        }
                        simplifiedMeals.splice(mealIndex, 1); // Rimuove il pasto assegnato dalla lista
                        item.cena = false; // Imposta cena a false
                    }
                }
            }
        }
        await AddMeal(remainingMeals)
        await user.save()

        res.json("ok")
    } catch (e) {
        console.error("Errore durante la creazione del nuovo menu:", e);
        res.status(500).json({ error: "Errore durante la creazione del nuovo menu" });
    }
});

router.get('/proviamolo/test/:username', async (req, res) => {
    const { username } = req.params
    console.log(username)
    try {
        const user = await User.findOne({ username: username })
        console.log(user)
        await sendPushNotification({ to: user.token, title: "Ciao", body: "prova" })
        res.json("ok")
    }
    catch (e) {
        console.log(e)
    }
})

const sendNotification = async (token, title, body) => {
    const message = {
        to: token,
        sound: 'default',
        title,
        body,
        data: { title, body }
    };

    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.status !== 200) {
            console.error(`Failed to send notification: ${response.statusText}`);
        }
        else {
            console.log("notifica inviata correttamente")
        }
    } catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
    }
};


const { DateTime } = require('luxon');
const { Expo } = require('expo-server-sdk');
const { ca } = require('date-fns/locale');
const { constructFromSymbol } = require('date-fns/constants');

const expo = new Expo({
    useFcmV1: true,
});

const sendPushNotification = async (message) => {
    try {
        // Check if the push token is a valid Expo push token
        if (!Expo.isExpoPushToken(message.to)) {
            console.error('Invalid push token');
            return;
        }

        // Send the push notification
        const response = await expo.sendPushNotificationsAsync([message]);
    } catch (error) {
        console.error('Error sending push notification:', error);
    }
};

const logMessage = async () => {
    const users = await User.find();

    // Otteniamo l'orario attuale in Italia
    const nowItaly = DateTime.now().setZone('Europe/Rome');
    const currentTime = nowItaly.hour * 60 + nowItaly.minute;

    const daysOfWeek = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
    const dayOfWeek = daysOfWeek[nowItaly.weekday - 1];

    for (const user of users) {
        const [lunchHour, lunchMinute] = user.orario_pranzo.split(':').map(Number);
        const [dinnerHour, dinnerMinute] = user.orario_cena.split(':').map(Number);

        const lunchTime = lunchHour * 60 + lunchMinute;
        const dinnerTime = dinnerHour * 60 + dinnerMinute;

        const timeDifference = 15;

        const meals = user[dayOfWeek];
        const lunchMealId = meals ? meals[0] : null;
        const dinnerMealId = meals ? meals[1] : null;

        let lunchMealName = '';
        let dinnerMealName = '';

        if (lunchMealId) {
            const lunchMeal = await Meal.findById(lunchMealId);
            lunchMealName = lunchMeal ? lunchMeal.nome : '';
        }

        if (dinnerMealId) {
            const dinnerMeal = await Meal.findById(dinnerMealId);
            dinnerMealName = dinnerMeal ? dinnerMeal.nome : '';
        }

        if (currentTime >= lunchTime - timeDifference && currentTime <= lunchTime) {
            if (lunchMealName) {
                await sendPushNotification({ to: user.token, title: "Promemoria pranzo", body: `È quasi ora di pranzo! Inizia a cucinare: ${lunchMealName}` });
            } else {
                await sendPushNotification({ to: user.token, title: "Promemoria pranzo", body: `È quasi ora di pranzo! Programma il tuo pranzo` });
            }
        }

        if (currentTime >= dinnerTime - timeDifference && currentTime <= dinnerTime) {
            if (dinnerMealName) {
                await sendPushNotification({ to: user.token, title: "Promemoria cena", body: `È quasi ora di cena! Inizia a cucinare: ${dinnerMealName}` });
            } else {
                await sendPushNotification({ to: user.token, title: "Promemoria cena", body: `È quasi ora di cena! Programma la tua cena` });
            }
        }
    }
};

cron.schedule('*/2 * * * *', logMessage);

router.get("/getMealsCategory/:categoria", async (req, res) => {
    const { categoria } = req.params
    try {
        const ingredients = await Ingredient.find({ categoria: new RegExp(`^${categoria}$`, "i") })
        const ingredientName = ingredients.map(ingredient => ingredient.nome);
        const meals = await Meal.find({
            ingredients: {
                $elemMatch: {
                    0: { $in: ingredientName.map(name => new RegExp(`^${name}$`, "i")) } // Cerca nel primo elemento del sotto-array
                }
            }
        }).limit(5);
        res.json(meals)
    }
    catch (e) {
        console.log(e)
    }
})

router.put('/updateIngredientQuantity/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity, username } = req.body;

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Trova l'elemento nella dispensa dell'utente
        const ingredient = user.dispensa.find(item => item.id === id);

        // Controlla se quantity è -1 e se la quantità attuale è già 0
        if (quantity === -1 && ingredient.quantity === 0) {
            console.log('La quantità non può scendere sotto lo zero');
        }

        // Esegui l'aggiornamento solo se la quantità può essere aggiornata correttamente
        const updatedIngredient = await User.findOneAndUpdate(
            {
                username: username,
                'dispensa.id': id
            },
            {
                $inc: {
                    'dispensa.$.quantity': quantity
                }
            },
            { new: true }
        );

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Ingrediente non aggiornato correttamente' });
        }

        res.json(updatedIngredient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel server' });
    }
});


//Esporto il router per poterlo utilizzare in altri file
module.exports = router;