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
     for(let i = 0; i < json.length; i++) {
      showFigure(json[i]);
     }
     
    } catch (error) {
      console.error(error.message);
    }
  }
  getWorks()

//===================afficher les figure==========================

function showFigure(data) { 
  const figure = document.createElement("figure"); 
  figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
    <figcaption>${data.title}</figcaption>`;

  document.querySelector(".gallery").append(figure);
}

