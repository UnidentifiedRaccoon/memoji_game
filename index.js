let list = document.querySelector(".game-cards");
let flipCardsCollection = list.querySelectorAll(".flip-card")

let flipCardsEmojiTypeArray =
    ["frog", "whale", "fish", "octopus",
        "crayfish", "crocodile", "frog", "whale",
        "fish", "octopus", "crayfish", "crocodile"];


function makeFlipCardClickListener (game, cardObjects) {
    function flipCardClickHandler(event) {
        let flipCardJsId = event.target.dataset.jsId;
        let flipCard = cardObjects[flipCardJsId];
        flipCard.disabled()
        flipCard.show()
        game.checkPair(flipCard)

    }

    list.addEventListener("click", flipCardClickHandler)
}

class FlipCard {
    constructor(ButtonElement, ContentElement, type, id) {
        this.content = ContentElement
        this.button = ButtonElement;
        this.type = type;
        this.addJsClass(type);
        this.setId(id);
    }

    addJsClass (str) {
        this.button.classList.add(`js-${str}`);
    }

    setId (id) {
        this.button.setAttribute('data-js-id', id.toString());
    }

    hide () {
        this.button.classList.remove('js-show-front')
    }

    show () {
        this.button.classList.add('js-show-front')
    }

    disabled () {
        this.button.setAttribute('disabled', 'true');
    }

    enabled () {
        this.button.removeAttribute('disabled')
    }

    onSuccess() {
        this.button.classList.add('js-success');
    }
    onFailure () {
        this.button.classList.add('js-failure');
        setTimeout(() => {
            this.hide();
            this.button.classList.remove('js-failure');
            this.enabled()
        }, 1500);

    }
}

class Game {
    constructor() {
        this.pairs = []
    }

    shuffle(array) {
// Алгоритм "Тасование Фишера — Йетса".
// Суть заключается в том, чтобы проходить по массиву
// в обратном порядке и менять местами каждый элемент
// со случайным элементом, который находится перед ним.
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    makeGameCards(cardsCollection, emojiArr) {
        let arr = [];
        for (let i = 0; i < cardsCollection.length; i++) {
            let [button, content] = cardsCollection[i].children;
            let newCard = new FlipCard(button, content, emojiArr[i], i)
            arr.push(newCard);
        }
        return arr;
    }

    checkPair(flipCardObj) {
        let isEven = this.pairs.length % 2 === 0

        if (isEven) { this.pairs.push(flipCardObj) }
        else {
            let prevFlipCardObj = this.pairs[this.pairs.length - 1]
            let hasEqualTypes = prevFlipCardObj.type === flipCardObj.type

            if (hasEqualTypes) {
                flipCardObj.onSuccess()
                prevFlipCardObj.onSuccess()
                this.pairs.push(flipCardObj)
            } else {
                //  this.pairs.pop() === prevFlipCardObj
                this.pairs.pop().onFailure()
                flipCardObj.onFailure()
            }
        }
    }
}

let game = new Game()
game.shuffle(flipCardsEmojiTypeArray)
let cardObjects = game.makeGameCards(flipCardsCollection, flipCardsEmojiTypeArray)
makeFlipCardClickListener(game, cardObjects)

