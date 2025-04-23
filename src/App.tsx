// FUNZIONE FETCH DI SUPPORTO
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



// TYPEGUARD - FETCH RECIPE

// ALIAS
/*
Costruisco un ALIAS che indichi che l'OBJECT che voglio ottenere dalla risposta alla Fetch contenga sicuramente la KEY "userId"
e forse altre chiavi a me sconosciute. Ecco perchè scrivo sotto che ci sono altre KEYS sconosciute.
*/
type RecipeResponse = {
  userId: number;
  [key: string]: unknown;
}

// VALIDATION
function isRecipeResponse(data: unknown): data is RecipeResponse {
  return (
    // Validazione TYPE della risposta
    typeof data === 'object' && data !== null &&
    // Verifica esistenza chiave "userId" e il suo TYPE
    'userId' in data && typeof (data as RecipeResponse).userId === 'number'
  );
}



// Costruisco la funzione per ricavare il dato richiesto (Compleanno dello Chef)
async function getChefBirthday(id: number): Promise<unknown> {

  // Dichiaro qui la variabile dove conterrò il risutato della prima fetch.
  let recipe: unknown;

  // Uso il TRY CATCH perchè è qui che voglio intercettare il mio ERROR della fetch se si verifica.
  try {
    recipe = await fetchJson(`https://dummyjson.com/recipes/${id}`);
    console.log('Ricetta:', recipe);
  } catch (error) {
    throw new Error(`Impossibile recuperare la ricetta con Id: ${id}`);
  }

  // Validazione del TYPE della RECIPE RESPONSE








  function App() {


    return (
      <>
        App content
      </>
    )
  }

  export default App
