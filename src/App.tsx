/*************************************************************************
# IMPORT
*************************************************************************/
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';



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
  birthDate?: unknown,
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
      'birthDate' in data && ((data as ChefResponse).birthDate instanceof Date || typeof (data as ChefResponse).birthDate === 'string') ||
      'message' in data && typeof (data as ChefResponse).message === 'string'
    )
  );
}



/*************************************************************************
# GET DATA
*************************************************************************/

async function getChefBirthday(id: number): Promise<Date | string | undefined> {

  // FETCH - RECIPE

  // Dichiaro qui la variabile dove conterrò il risutato della fetch della Recipe.
  let recipe: unknown;

  // Uso il TRY-CATCH perchè è qui che voglio intercettare il mio ERROR della fetch se si verifica.
  try {
    recipe = await fetchJson(`https://dummyjson.com/recipes/${id}`);
    // console.log('Ricetta:', recipe);
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



  // FETCH - CHEF

  let chef: unknown;

  try {
    chef = await fetchJson(`https://dummyjson.com/users/${recipe.userId}`);
    // console.log('Chef:', chef);
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

  // RESULT
  // Siccome "chef.birthDate" viene ancora considerato come "unknown", devo specificare che questo RETURN riceverà un valore di tipo STRING o DATE.
  const result = dayjs(chef.birthDate as string | Date).format('DD/MMM/YYYY');
  console.log(`Data di nascita dello chef con ID ${recipe.userId}: ${result}`)
  return result;
}



// IIFE ( immediately invoked function expression )
// (async () => {
//   try {
//     const birthday = await getChefBirthday(1);
//     console.log('Data di nascita dello chef:', birthday);
//   } catch (error) {
//     console.error('Errore durante il recupero della data di nascita:', error);
//   }
// })();






function App() {

  // STAMPA DINAMICA
  /*
  Tramite USE-STATE + USE-EFFECT raccolgo il dato della mia Fetch e lo imposto come State.
  */
  const [birthday, setBirthday] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    async function fetchBirthday() {
      try {
        const date = await getChefBirthday(1);
        setBirthday(date as string);
      } catch (error) {
        console.error('Errore durante la Fetch:', error);
        setError((error as Error).message);
      }
    }

    fetchBirthday();
  }, []);

  return (
    <>
      {error ? (
        <h1>Errore: {error}</h1>
      ) : birthday ? (
        <h1>Data di nascita dello Chef: {birthday}</h1>
      ) : (
        <h1>Fetch in corso</h1>
      )}
    </>
  );
}

export default App;
