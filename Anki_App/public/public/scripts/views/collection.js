import utils from "../services/utils.js";

let collection = {
    render : async () => {
        let view =  /*html*/`
        <form id="collection-add-form" class="collection-form">
            <h1>Edit collection</h1>
            <div class="collection-form-name">
                <input id="col-name" type="text" placeholder="Collection name">
                <button id="collection-form-save-button">Save</button>
            </div>
            <section class="collections">
                <ul id="cards-list" class="collections-list">
                </ul>
            </section>
            </form>
        `
        return view
    }
    , after_render: async () => {
        const form = document.getElementById('collection-add-form');
        form.addEventListener('submit', function(e){
            e.preventDefault();
        });

        const colNameInput = document.getElementById('col-name');
        const colSaveBtn = document.getElementById('collection-form-save-button');
        const cardsList = document.getElementById('cards-list');

        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');

        const request = utils.parseRequestURL();

        if (request.id != null){
            console.log(request.id);
            collectionsRef.child(request.id).on('value', function(snapshot) {
                let snap = snapshot.val();
                console.log(snap);
                colNameInput.value = snap.name;
            });

            
            cardsRef.on('value', function(snapshot) {
                const snap = snapshot.val();
                console.log(snap);
                for (let item in snap){
                    console.log(snap[item]['collectionId']);
                    if (snap[item]['collectionId'] == request.id){
                        cardsList.insertAdjacentHTML("afterbegin", InsertCard(snap[item]['front'], item));
                    } 
                }
            });
        }


        colSaveBtn.addEventListener('click', function(e){
            const colName = colNameInput.value.trim();
            //let id = request.id != null ? request.id : collectionsRef.push().key;
            if (request.id != null){
                let id = request.id;
                collectionsRef.child(id).update ({
                    name: colName,
                });
            }else{
                let id = collectionsRef.push().key;
                collectionsRef.child(id).update ({
                    name: colName,
                    cardsFailed: 0,
                });
            }

            history.back();
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

export default collection;