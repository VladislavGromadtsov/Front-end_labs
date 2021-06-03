import utils from "../services/utils.js";

let play = {
    render : async () => {
        let view =  /*html*/`
        <section class="collection-play">
        <div id="current-card" class="card-info-front">
            <h3 id="card-side"></h3>
            <p id="card-side-info"></p>
        </div>
        <div class="collection-play-statistics">
            <span>Collection name</span>
            <div class="collection-play-statistics-score-time">
                <h2>Cards</h2>
                <h2>Time</h2>
            </div>
            <div class="collection-play-statistics-res">
                <span id="cards-left" class="score-span"></span>
                <span id="time-left" class="time-span">0</span>
            </div>
        </div>
    </section>
    <section class="collection-play-buttons">
        <button id="bad-button">Bad</button>
        <button id="good-button">Good</button>
    </section>
        `
        return view
    }
    , after_render: async () => {
        const ref = firebase.database().ref();
        const collectionsRef = ref.child(localStorage.getItem('uid')).child('collections');
        const cardsRef = ref.child(localStorage.getItem('uid')).child('cards');
        const statisticsRef = ref.child(localStorage.getItem('uid')).child('statistics');
        
        const request = utils.parseRequestURL();
        
        const goodBtn = document.getElementById('good-button');
        const badBtn = document.getElementById('bad-button');
        const cardSide = document.getElementById('card-side');
        const cardInfo = document.getElementById('card-side-info');
        const cardsLeft = document.getElementById('cards-left');
        const timeLeft = document.getElementById('time-left');
        const crntCardD = document.getElementById('current-card');
        let sec = 0;
        

        let cards = [];
        let currentCard;
        
        hideBtn();

        cardsRef.on('value', function(snapshot){
            let snap = snapshot.val();
            for (let item in snap){
                if (snap[item]['collectionId'] = request.id){
                    cards.push({
                        front: snap[item]['front'],
                        back: snap[item]['back'],
                        cardId: item,
                    })
                }
            }

            if (cards.length != 0){
                setInterval(tick, 1000);
                next();
            }
        });

        function tick(){
            sec++;
            timeLeft.textContent = sec;
        }

        function next(){
            if (cards.length == 0){
                endCollection();
                return;
            }
            hideBtn();

            currentCard = cards.pop();
            cardSide.textContent = 'Front';
            cardInfo.textContent = currentCard.front;
            cardsLeft.textContent = cards.length;
        }

        goodBtn.addEventListener('click', function(e){
            statisticsRef.update({
                completedCards: firebase.database.ServerValue.increment(1),
            })

            next();
        })

        badBtn.addEventListener('click', function(e){
            collectionsRef.child(request.id).update ({
                cardsFailed: firebase.database.ServerValue.increment(1),
            });
            
            cards.unshift(currentCard);
            next();
        })

        crntCardD.addEventListener('click', function(e){
            showBtn();
            
            cardSide.textContent = 'Back';
            cardInfo.textContent = currentCard.back;
        })


        function hideBtn(){
            goodBtn.style.visibility='hidden';
            badBtn.style.visibility='hidden';
        }

        function showBtn(){
            goodBtn.style.visibility='visible';
            badBtn.style.visibility='visible';
        }

        function endCollection(){
            statisticsRef.update({
                timeSpent: firebase.database.ServerValue.increment(parseInt(timeLeft.textContent)),
            })
            
            window.location.replace('#/collections');
        }
      
    }

}

export default play;