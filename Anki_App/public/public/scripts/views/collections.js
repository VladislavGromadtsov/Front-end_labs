let collections = {
    render : async () => {
        let view =  /*html*/`   
        <h1>Collections</h1>
        <button id="add-collection-button">+</button>
        <section class="collections">
            <ul id="col-list" class="collections-list">     
            </ul>
        </section>
        `
        return view
    }
    , after_render: async () => {
        const colAddBtn = document.getElementById('add-collection-button');
        colAddBtn.addEventListener('click', function(e){
            window.location.replace('#/create-collection');
        })

        const colList = document.getElementById('col-list');
        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        
        collectionsRef.on('value', function(snapshot){
            let snap = snapshot.val();
            for (let item in snap){
                colList.insertAdjacentHTML("afterbegin", InsertCol(snapshot.child(item).val().name, item));
            }
        });

        function InsertCol(cardName, id){
            let card = `
            <li>
                <div class="collections-list-item">
                    <h4>${cardName}</h4>
                    <button onclick="window.location='/#/collection/${id}/play'" class="start-collection-button">Start</button>
                    <button onclick="window.location='/#/collection/${id}/edit'" class="edit-button">Edit</button>
                    <button onclick="window.location='/#/collection/${id}/delete'" class="delete-button">Delete</button>
                </div>
            </li>  
            `
            return card
        }
    }

}

export default collections;