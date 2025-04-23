// Funzione FETCH di supporto
/* Per prima cosa definisco la mia funzione di supporto per la Fetch.
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

