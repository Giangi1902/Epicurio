const mongoose = require("mongoose");                   //importo il modulo mongoose
mongoose.connect("mongodb+srv://gianludigia:4UFYjU0qGimW8oxq@myexpense.z5jz05w.mongodb.net/?retryWrites=true&w=majority&appName=MyExpense")    //connessione al database mongodb
  //sudo systemctl stop ufw


  //se la connessione avviene correttamente stampo "mongodb connected", altrimenti "failed"
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log('retard');
  });

//Stabilisco uno schema di mongoose, per definire la struttura dati per la gestione degli utenti
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  orario_pranzo: {
    type: String
  },
  orario_cena: {
    type: String
  },
  imageprofile: {
    type: String,
    default: ""
  },
  checklist: {
    type: Array,
    default: []
  },
  token: {
    type: String,
    default: ""
  },
  //come salvare le ricette giornaliere?
});

const pantrySchema = new mongoose.Schema({
  idUtente: {
    type: String,
    required: true
  },
  idIngredienti: {
    type: Array,
    default: []
  },
  available: {
    type: Boolean,
    default: true
  }
})

const ingredientSchema = new mongoose.Schema({
  nome: {
    type: String,
    default: ""
  },
  categoria: {
    type: String,
    default: ""
  },
  apporto_calorico: {
    type: Number,
    default: ""
  }
})

const mealSchema = new mongoose.Schema({
  nome: {
    type: String,
    default: ""
  },
  ingredients: {
    type: Array,
    default: []
  },
  description: {
    type: String,
    default: ""
  },
  timing: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: Number,
    default: 0
  },
  images: {
    type: Array,
    default: []
  },
  banned: {
    type: Array,
    default: []
  },
  icon: {
    type: String,
    default: ""
  },
  raters: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  }
})

//Creo il modello collection, associato allo schema creato precedentemente
const User = mongoose.model("User", userSchema);
const Ingredient = mongoose.model("Ingredient", ingredientSchema)
const Meal = mongoose.model("Meal", mealSchema)
const Pantry = mongoose.model("Pantry", pantrySchema)


//Esporto il modulo collection così da poterlo utilizzare in altri file
module.exports = { User, Ingredient, Meal, Pantry };
