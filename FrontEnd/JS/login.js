const loginApi = "http://localhost:5678/api/users/login";


document.querySelector("loginform") 
    addEventListener("submit", entranceLogin)

// la fonction est appelé lorsque le formulaire est soumis
async function entranceLogin(event) {
    event.preventDefault();

    
    let user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    let response = await fetch(loginApi, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
        },
    body: JSON.stringify(user),
    });
    
    if (response.status != 200) { 
        if (!document.querySelector('.error')) { 
            const errorMessage = document.createElement("div");
            errorMessage.className = "error";
            errorMessage.innerHTML = "Email ou Mot de passe incorrect";
            document.querySelector("form").prepend(errorMessage);
        }
    }
    else {
        let result = await response.json(); 
        const token = result.token; 
        sessionStorage.setItem("authToken", token);
        window.location.href = ("index.html");
    }
   
}