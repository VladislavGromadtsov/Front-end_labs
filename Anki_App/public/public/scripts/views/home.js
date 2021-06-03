import utils from "../services/utils.js";

let home = {
    render : async () => {
        let view =  /*html*/`
        <section class="section-welcome-stats">
        <div class="div-welcome">
            <h2>Welcome, user</h2>
            <p>You have cards to repeat</p>
            <button id="div-welcome__repeat-button">Repeat</button>
        </div>
        <div class="div-statistics">
            <div>
                <h3>Cards completed</h3>
                <h3>Time spent</h3>                
            </div>
            <div>
                <span id="score-stat"></span>
                <span id="time-stat"></span>
            </div>
        </div>
        </section>
    
        <section class="collections">
        <ul id="repeat-list" class="collections-list">
        </ul>
        </section>
        `
        return view
    }
    , after_render: async () => {
        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        const statisticsRef = ref.child(localStorage.getItem('uid')).child('statistics');

        const scoreTab = document.getElementById('score-stat');
        const timeTab = document.getElementById('time-stat');
        const repeatList = document.getElementById('repeat-list');
        const repeatBtn = document.getElementById('div-welcome__repeat-button');

        let failedCards = [];
       
        statisticsRef.on('value', function(snapshot){
            let snap = snapshot.val();
            scoreTab.textContent = snap.completedCards;
            timeTab.textContent = snap.timeSpent;
        });

        collectionsRef.on('value', function(snapshot){
            let snap = snapshot.val();
            for (const key in snap) {
                snap[key]['id'] = key;
            }
            failedCards = Object.values(snap).filter(el => el['cardsFailed'] != undefined && el['cardsFailed'] != null);
            failedCards.forEach(el => {
                repeatList.insertAdjacentHTML("afterbegin", InsertCol(el.name, el.id));
            })
        });

        repeatBtn.onclick = () => {
            window.location=`/#/collection/${failedCards[0].id}/play`;
        }


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

export default home;