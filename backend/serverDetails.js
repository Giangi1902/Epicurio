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
  }
});

const pantrySchema = new mongoose.Schema({
  idUtente: {
    type: String,
    required: true
  },
  idIngredienti: [
    {
      id: { type: String },
      quantity: { type: Number }
    }
  ]
});

const ingredientSchema = new mongoose.Schema({
  nome: {
    type: String,
    default: ""
  },
  categoria: {
    type: String,
    default: ""
  }
})

const mealSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  ingredients: {
    type: Array,
    default: []
  },
  details: {
    type: Array,
    default: []
  },
  ratings: [{
    idUtente: {
      type: String,
      required: true
    },
    valutazione: {
      type: Number,
      required: true
    }
  }]
})

//schema per la gestione giornaliera dei pasti 
const dailySchema = new mongoose.Schema({
  idUtente: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  pasti: {
    colazione: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      default: null,
    },
    pranzo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      default: null,
    },
    cena: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      default: null,
    }
  },
  checkedPranzo: {
    type: Boolean,
    default: false
  },
  checkedCena: {
    type: Boolean,
    default: false
  }
});




//Creo il modello collection, associato allo schema creato precedentemente
const User = mongoose.model("User", userSchema);
const Ingredient = mongoose.model("Ingredient", ingredientSchema)
const Meal = mongoose.model("Meal", mealSchema)
const Pantry = mongoose.model("Pantry", pantrySchema)
const Daily = mongoose.model("Daily", dailySchema)


//Esporto il modulo collection così da poterlo utilizzare in altri file
module.exports = { User, Ingredient, Meal, Pantry, Daily };
