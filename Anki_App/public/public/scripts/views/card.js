import utils from "../services/utils.js";

let card = {
    render : async () => {
        let view =  /*html*/`
        <h1>Edit card</h1>
        <form id="card-add-form" class="card-form">
            <section class="card-info">
                <div class="card-info-front">
                    <h3>Front</h3>
                    <textarea id="front-card" placeholder="Front info"></textarea>
                </div>
                <div class="card-info-back">
                    <h3>Back</h3>
                    <textarea id="back-card" placeholder="Back info"></textarea>
                </div>
            </section>

            <section class="card-collection">
                <div>
                    <label for="collection-select">Set collection:</label>
                    <select id="collection-select">Collection name</select>
                </div>
            </section>

            <button id="card-save-button" class="card-info-save-button">Save</button>
        </form>
        `
        return view
    }
    , after_render: async () => {
        const form = document.getElementById('card-add-form');
        form.addEventListener('submit', function(e){
            e.preventDefault();
        });

        const frontInput = document.getElementById('front-card');
        const backInput = document.getElementById('back-card');
        const select = document.getElementById('collection-select');
        const cardSaveBtn = document.getElementById('card-save-button');

        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');

        collectionsRef.on("value", function(snapshot) {
            const snap = snapshot.val();
            for (let item in snap){
                let newOpt = new Option(snap[item].name, item);
                select.append(newOpt); 
            }
        });

        const request = utils.parseRequestURL();
        
        if (request.id != null){
            let cardRef = cardsRef.child(request.id);
            cardRef.on("value", function(snapshot) {
                const snap = snapshot.val();
                frontInput.value = snap.front;
                backInput.value = snap.back;
                select.value = snap.collectionId;
            });
        }

        cardSaveBtn.addEventListener('click', function(e){
            let id = request.id != null ? request.id : cardsRef.push().key;
            cardsRef.child(id).update({
                front: frontInput.value.trim(),
                back: backInput.value.trim(),
                collectionId: select.value,
            })
            
            history.back();
        })
        
    }

}

export default card;