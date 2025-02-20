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
    const  trashIcon = document.querySelectorAll(".fa-trash-can");
    trashIcon.forEach((e) => 
      e.addEventListener('click', (event) => deleteWorks(event))); 
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

//==========fonction supprimer les éléments=====================

async function deleteWorks(event) {
  const token = sessionStorage.authToken; 
  const id = event.srcElement.id;
  const deleteApi = "http://localhost:5678/api/works/";
  let response = await fetch(deleteApi + id, { 
    method: "DELETE",
    headers: { 
      Authorization: "Bearer " + token,
    },
  });
  if (response.ok) {
    document.querySelector(".modal-wrapper").innerHTML = `
			<div class="fermer"><i></i> <i class="fa-solid fa-xmark"></i></div>
			<p title="titlemodal" class="gallery-photo"> Galerie photo</p>
			<div class="gallery-modal"></div>
			<div class="addPhotoForm "></div>
			<hr/>
			<input class="addPhoto" type="submit" value="Ajouter une photo">
		</div>`
  getWorks();
  addEventListenerToAddPhotoButton()
  addEventListenercloseModal()
}
}

//==========afficher & ajouter une photo dans la modale=====================

const showAddPhotoModal = function () {
  // Contenu de la modale
  document.querySelector(".modal-wrapper").innerHTML = `
    <div class="fermer">
      <i class="fa-solid fa-arrow-left"></i>
      <i class="fa-solid fa-xmark"></i>
    </div>
    <p title="titlemodal" class="gallery-photo">Ajout photo</p>
    <div class="center">
      <div class="blue">
        <div id="preview-container"></div>
        <i class="fa-regular fa-image"></i>
        <label for="plusPhoto" class="formFile">+ Ajouter photo</label>
        <input id="plusPhoto" type="file" accept="image/jpg, image/png">
        <p class="format">jpg, png : 4mo max</p>
      </div>
      <div class="addPhotoForm">
        <form class="valider" action="#" method="post">
          <label for="title">Titre</label>
          <input type="text" name="title" id="title" />
          <label for="category">Catégorie</label>
          <select name="category" id="category">
            <option value="">Sélectionnez une catégorie</option>
            <option value="1">Objets</option>
            <option value="2">Appartements</option>
            <option value="3">Hôtels & restaurants</option>
          </select>
          <hr/>
          <input type="submit" value="Valider" id="valider">
        </form>
      </div>
    </div>
  `;
  
  const backButton = document.querySelector(".fa-arrow-left");
  backButton.addEventListener("click", () => { 
    document.querySelector(".modal-wrapper").innerHTML = `
			<div class="fermer"><i></i> <i class="fa-solid fa-xmark"></i></div>
			<p title="titlemodal" class="gallery-photo"> Galerie photo</p>
			<div class="gallery-modal"></div>
			<div class="addPhotoForm "></div>
			<hr/>
			<input class="addPhoto" type="submit" value="Ajouter une photo">
		</div>
    `;
    getWorks();
    addEventListenerToAddPhotoButton(); 
    addEventListenercloseModal()
  });
  
  document.getElementById("plusPhoto").addEventListener("change", function (event) { 
    const file = event.target.files[0]; 

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 4 * 1024 * 1024) { 
      const reader = new FileReader(); 
      reader.onload = function (e) { 
        const previewContainer = document.getElementById("preview-container");
        const faImage = document.querySelector(".fa-image");
        const buttonAddPhotoPlus = document.querySelector(".formFile");
        const formatImage = document.querySelector(".format");
        faImage.style.display = "none"; 
        buttonAddPhotoPlus.style.display = "none"; 
        formatImage.style.display = "none"; 
        previewContainer.innerHTML = '';
        const img = document.createElement("img"); 
        img.src = e.target.result;
        img.alt = "uploaded photo"; 
        img.style.maxWidth = "126px"; 
        previewContainer.appendChild(img); 
      };

      reader.readAsDataURL(file);
    }
  });
  addEventListenercloseModal(); 
};

//===========la fonction ajoute un eventlistener à un bouton======================

function addEventListenerToAddPhotoButton() {
  const addPhotoButton = document.querySelector(".addPhoto"); 
  if (addPhotoButton) { 
    addPhotoButton.addEventListener('click', showAddPhotoModal); 
  }
}