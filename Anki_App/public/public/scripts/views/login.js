let login = {
    render : async () => {
        let view =  `
        <section class="login-page">
        <article class="app-info">
            <h1>Anki-alike App</h1>
            <p>Anki is a program which makes remembering things easy.
                Because it's a lot more efficient than traditional study methods,
                 you can either greatly decrease your time spent studying, 
                or greatly increase the amount you learn.</p>
        </article>
        <form id="login-form">
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
                <button id="sign-in" class="sign-in-button">SignIn</button>
            </div>
        </form>
        </section>
        `
        return view
    }
    , after_render: async () => {
        const passwordInput = document.getElementById('password-input');
        const emailInput = document.getElementById('email-input');
        const signInButton = document.getElementById('sign-in')

        const form = document.getElementById('login-form')
        form.addEventListener('submit', function(e){
            e.preventDefault();
        })

        signInButton.addEventListener('click', function(e){
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
                window.location.replace('#/');
            }).catch((error) =>{
                let errorCode = error.code;
                let errorMessage = error.message;
            });
        })
    }

}

export default login;