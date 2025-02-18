//===============recupération des travaux depuis API============================

async function getWorks(filter) {
  document.querySelector(".gallery").innerHTML = "";
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url); 
    if (!response.ok) { 
      throw new Error(`Reponse status: ${response.status}`); 
    }
    const json = await response.json(); 
    if (filter) { 
      const filtrer = json.filter((data) => data.categoryId === filter);
      for (let i = 0; i < filtrer.length; i++) { 
        showFigure(filtrer[i]); 
      }
    }
    else {
      for (let i = 0; i < json.length; i++) { 
        showFigure(json[i]);
      }
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

//=============création des boutons categories================

async function createFilterButtons() { 
  const url = "http://localhost:5678/api/categories"; 
  try {
    const response = await fetch(url); 
    if (!response.ok) { 
      throw new Error(`Reponse status: ${response.status}`); 
    }
    const json = await response.json();
    for (let i = 0; i < json.length; i++) { 
      createFilterButton(json[i]); 
    }
  } catch (error) {
    console.error(error.message); 
  }
}
createFilterButtons();

//===========creation des boutons qui permettent de filtrer les projets par catégorie==============

function createFilterButton(data) {
  const div = document.createElement("div");
  div.className = data.id;
  div.addEventListener("click", () => getWorks(data.id)); 
  div.innerHTML = `${data.name}`;
  document.querySelector(".div-container").append(div); 
}
document.querySelector(".all-categories").addEventListener("click", () => getWorks());