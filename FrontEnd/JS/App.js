//===============recupération des travaux depuis API============================

async function getWorks() {
    document.querySelector(".gallery").innerHTML = ""; 
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url); 
      if (!response.ok) { 
        throw new Error(`Reponse status: ${response.status}`);
      }
      const json = await response.json();
     console.log(json)
    } catch (error) {
      console.error(error.message);
    }
  }
  getWorks()
  
  