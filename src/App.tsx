/*************************************************************************
# UTILITY FUNCTIONS
*************************************************************************/

/*
Per prima cosa definisco la mia funzione di supporto per la Fetch.
Siccome non so che tipo di dati riceverò ed in ogni caso non posso ricordare o elencare tutte le KEYS dell'OBJECT che ricevo, procedo specificando che la risposta sarà di tipo UNKNOWN. Dato che tutte le risposte alle fetch contengono la KEY "ok", mi accerto prima di tutto che la richiesta vada a buon fine, o lancio un ERROR.
*/
async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore nella fetch: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
}



/*************************************************************************
# TYPE GUARDS
*************************************************************************/

// TYPEGUARD - FETCH RECIPE

// ALIAS
/*
Costruisco un ALIAS che indichi che l'OBJECT che voglio ottenere dalla risposta alla Fetch contenga sicuramente la KEY "userId"
e forse altre chiavi a me sconosciute. Ecco perchè scrivo sotto che ci sono altre KEYS sconosciute.
*/
type RecipeResponse = {
  userId?: number,
  message?: string,
  [key: string]: unknown,
}

// VALIDATION
function isRecipeResponse(data: unknown): data is RecipeResponse {
  return (
    // Validazione TYPE della risposta
    typeof data === 'object' && data !== null &&
    // Verifica esistenza chiave "userId" e il suo TYPE
    (
      'userId' in data && typeof (data as RecipeResponse).userId === 'number' ||
      'message' in data && typeof (data as RecipeResponse).message === 'string'
    )
  );
}


// TYPEGUARD - FETCH CHEF

// ALIAS
type ChefResponse = {
  birthDate?: Date,
  message?: string,
  [key: string]: unknown,
}

// VALIDATION
function isChefResponse(data: unknown): data is ChefResponse {
  return (
    // Validazione TYPE della risposta
    typeof data === 'object' && data !== null &&
    // Verifica esistenza chiave "userId" e il suo TYPE
    (
      'birthDate' in data && (data as ChefResponse).birthDate instanceof Date ||
      'message' in data && typeof (data as ChefResponse).message === 'string'
    )
  );
}



/*************************************************************************
# GET DATA
*************************************************************************/

async function getChefBirthday(id: number): Promise<unknown> {

  // Dichiaro qui la variabile dove conterrò il risutato della fetch della Recipe.
  let recipe: unknown;

  // Uso il TRY CATCH perchè è qui che voglio intercettare il mio ERROR della fetch se si verifica.
  try {
    recipe = await fetchJson(`https://dummyjson.com/recipes/${id}`);
    console.log('Ricetta:', recipe);
  } catch (error) {
    throw new Error(`Impossibile recuperare la ricetta con Id: ${id}`);
  }

  // VALIDATION - RECIPE RESPONSE
  if (!isRecipeResponse(recipe)) {
    throw new Error(`Il formato dei dati ricevuti dalla fetch della "recipe" non è valido.`);
  }

  // ERROR HANDLING - ID NOT FOUND
  if (recipe.message) {
    /* Gestisco qui il caso di ERROR in cui non esista un elemento con quello specifico ID, ed interrompo il codice.
    So per certo che esiste un ".message" perchè gli oggetti "ERROR" sono sempre formati da NAME + MESSAGE. */
    throw new Error(recipe.message);
  }



  // Dichiaro qui la variabile dove conterrò il risutato della fetch dello Chef.
  let chef: unknown;

  // FETCH - CHEF
  try {
    chef = await fetchJson(`https://dummyjson.com/users/${recipe.userId}`);
    console.log('Chef:', chef);
  } catch (error) {
    throw new Error(`Impossibile recuperare lo Chef con Id: ${recipe.userId}`);
  }

  // VALIDATION - CHEF RESPONSE
  if (!isChefResponse(chef)) {
    throw new Error(`Il formato dei dati ricevuti dalla fetch dello "chef" non è valido.`);
  }

  // ERROR HANDLING - ID NOT FOUND
  if (chef.message) {
    throw new Error(chef.message);
  }









  // // Formattazione della data tramite libreria DAYJS (vedi script importato su index.html)
  // const formattedBirthdayDate = dayjs(chef.birthDate).format('DD/MM/YYYY');

  // // Il RETURN avviene solo nel caso in cui non ci siano errori.
  // return formattedBirthdayDate;
}




function App() {


  return (
    <>
      App content
    </>
  )
}

export default App
