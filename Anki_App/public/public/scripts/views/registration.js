let registration = {
    render : async () => {
        let view =  /*html*/`
        <section class="login-page">
        <article class="app-info">
            <h1>Anki-alike App</h1>
            <p>Anki is a program which makes remembering things easy.
                Because it's a lot more efficient than traditional study methods,
                 you can either greatly decrease your time spent studying, 
                or greatly increase the amount you learn.</p>
        </article>
        <form id="registration-form">
            <div class="login-form-inputs">
                <nav class="navbar-login">
                    <a href="#/login">Login</a>
                    <a href="#/registration">SignUp</a>
                </nav>
                <hr>
                <div class=login-form-inputs-container>
                    <input id="email-input" type="email" placeholder="Email">
                    <input id="password-input" type="password" placeholder="Password">
                </div>
                <button id="sign-up" class="sign-in-button">SignUp</button>
            </div>
        </form>
        </section>
        `
        return view
    }
    , after_render: async () => {
        const passwordInput = document.getElementById('password-input');
        const emailInput = document.getElementById('email-input');
        const signUpButton = document.getElementById('sign-up')

        const form = document.getElementById('registration-form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        })

        signUpButton.addEventListener('click', function(e){
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            console.log(email, password);
            firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
                window.location.replace('#/');  
            }).catch((error) =>{
                console.log("error");
                let errorCode = error.code;
                let errorMessage = error.message;
            });
        })
    }

}

export default registration;