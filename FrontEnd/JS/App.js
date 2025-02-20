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
        showFigureModal(filter[i]);
      }
    }
    else {
      for (let i = 0; i < json.length; i++) { 
        showFigure(json[i]);
        showFigureModal(json[i]);
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
  const aLink = document.querySelector(".js-modal");
  const logOut = document.getElementById("logout");
  if (sessionStorage.authToken) {
    const editBanner = document.createElement('div');
    editBanner.className = "edit";
    editBanner.innerHTML = `<p><i class="fa-regular fa-pen-to-square"></i> Mode édition</p>`;
    document.body.prepend(editBanner);
    const hiddenFilter = document.querySelector(".div-container");
    const logIn = document.getElementById("logIn");
    logIn.style.display = "none";
    logOut.style.visibility = "visible";
    hiddenFilter.style.display = "none";
    aLink.style.visibility = "visible";
  } else {
    logIn.style.visibility = "visible";
    logOut.style.display = "none";
    aLink.style.display = "none";
  }
  logOut.addEventListener("click", e => {
    sessionStorage.clear();
  })
};
checkAndSwitchToConnectedMode();

//=======================Modale=======================================
const modal = document.querySelector('.modal')
modal.style.visibility = "hidden"
const openModal = document.querySelector(".js-modal");
openModal.addEventListener("click", () => {
  modal.style.visibility = "visible"
  addEventListenerToAddPhotoButton();
});

//===========fonction fermer la modale========================

function addEventListenercloseModal() {
  const closeModal = document.querySelector(".fa-xmark");
  closeModal.addEventListener("click", () => {
    modal.style.visibility = "hidden"
  });
}
addEventListenercloseModal();

//=========afficher les figures modal==========================

function showFigureModal(data) {
  const figure = document.createElement("figure"); 
  figure.innerHTML = `<div class="image-container">
<img src="${data.imageUrl}" alt="${data.title}">
<i id=${data.id} class="fa-solid fa-trash-can delete-icon" style="color: #f7f9fc;" title="Supprimer"></i>
</div>`;

  document.querySelector(".gallery-modal").append(figure);
}