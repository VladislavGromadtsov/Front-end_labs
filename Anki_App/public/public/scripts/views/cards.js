let cards = {
    render : async () => {
        let view =  /*html*/`
        <h1>Cards</h1>
        <button id="add-card-button">+</button>
        <section class="collections">
            <ul id="all-cards-list" class="collections-list">    
            </ul>
        </section>
        `
        return view
    }
    , after_render: async () => {
        const cardAddBtn = document.getElementById('add-card-button');
        cardAddBtn.addEventListener('click', function(e){
            window.location.replace('#/create-card');
        })

        const cardsList = document.getElementById('all-cards-list');
        const ref = firebase.database().ref();
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');

        cardsRef.on('value', function(snapshot){
            let snap = snapshot.val();
            for (let item in snap){
                cardsList.insertAdjacentHTML("afterbegin", InsertCard(snapshot.child(item).val().front, item));
            }
        });

        function InsertCard(front, id){
            let card =`
            <li>
                <div class="collections-list-item">
                    <h4>${front}</h4>
                    <button onclick="window.location='/#/card/${id}/edit'" class="edit-button">Edit</button>
                    <button onclick="window.location='/#/card/${id}/delete'" class="delete-button">Delete</button>
                </div>
            </li>`
            return card;
        }
    }

}

export default cards;