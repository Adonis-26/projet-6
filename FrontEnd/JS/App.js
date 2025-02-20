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

//======== vérifier si user est connecté =======================

function checkAndSwitchToConnectedMode() {
  const logOut = document.getElementById("logout");
  if (sessionStorage.authToken) { 
    const editBanner = document.createElement('div');
    editBanner.className = "edit";
    editBanner.innerHTML = `<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>`;
    document.body.prepend(editBanner);
    const logIn = document.getElementById("logIn");
    logIn.style.display = "none";
    logOut.style.visibility = "visible";
  } else {
    logIn.style.visibility = "visible";
    logOut.style.display = "none";
  }
  logOut.addEventListener("click", e => {
    sessionStorage.clear();
  })
}