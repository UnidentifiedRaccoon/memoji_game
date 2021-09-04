import FlipCard from './FlipCard.js'
import Timer from './Timer.js'

// Для обработки карточек
let list = document.querySelector(".game-cards")
let cardButtonsCollection = list.querySelectorAll(".flip-card__button")

// Для обработки модальных окон
let modalsOuterWrapper = document.querySelector('.modals-outer-wrapper')
let modals = modalsOuterWrapper.querySelectorAll('.modal')


class Game {
    constructor() {
        this.pairs = []
        this.emojiArr = ["frog", "whale", "fish", "octopus",
            "crayfish", "crocodile", "frog", "whale",
            "fish", "octopus", "crayfish", "crocodile"];
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

    setGameCardsFirst(buttonsCollection) {
        this.shuffle(this.emojiArr)
        this.cardObjects = [];
        for (let i = 0; i < buttonsCollection.length; i++) {
            let newCard = new FlipCard(buttonsCollection[i], this.emojiArr[i], i)
            this.cardObjects.push(newCard);
        }
    }

    setClickListenerOnCards() {
        let _this = this
        function setCardClickHandler(event) {
            if (event.target.classList.contains('flip-card__button')) {
                let flipCardJsId = event.target.dataset.jsId;
                let flipCard = _this.cardObjects[flipCardJsId];
                flipCard.disabled()
                flipCard.show()
                _this.checkPair(flipCard)
            }
        }

        list.addEventListener("click", setCardClickHandler)
    }

    setTimer() {
        // Функция вызывается единожды для создания таймера
        // Далее таймер будет сбрасываться, но не создаваться заново
        this.timer = new Timer(this)
    }

    setModals() {
        this.modalWin = modals[0];
        this.modalLose = modals[1];
        modalsOuterWrapper.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                game.reload()
                // ToDo - game.reload()
            }
        })
    }

    initFirstSession() {
        this.setGameCardsFirst(cardButtonsCollection)
        this.setClickListenerOnCards()
        this.setTimer()
        this.timer.setStartClickListener(list)
        this.setModals()
    }

    checkPair(flipCardObj) {
        let isEven = this.pairs.length % 2 === 0;

        if (isEven) { this.pairs.push(flipCardObj) }
        else {
            let prevFlipCardObj = this.pairs[this.pairs.length - 1]
            let hasEqualTypes = prevFlipCardObj.button.dataset.jsType === flipCardObj.button.dataset.jsType

            if (hasEqualTypes) {
                flipCardObj.onSuccess()
                prevFlipCardObj.onSuccess()
                this.pairs.push(flipCardObj)
                if (this.pairs.length === 12) {
                    this.win()
                }
            } else {
                //  this.pairs.pop() === prevFlipCardObj
                this.pairs.pop().onFailure()
                flipCardObj.onFailure()
            }
        }
    }

    win() {
        this.modalWin.classList.remove("js-hidden")
        this.timer.stop()
    }

    lose() {
        this.modalLose.classList.remove("js-hidden")
        this.timer.stop()
    }

    reloadCards() {
        this.pairs.map(item => {
            item.button.classList.remove("js-success")
            item.hide()
            item.enabled()
        })
        this.pairs = []
        this.shuffle(this.emojiArr)
        setTimeout(() => {
            this.cardObjects.map((item, index) => {
                item.button.dataset.jsType = this.emojiArr[index]
            })
        }, 1000)

    }

    reload() {
        // Сброс карточек
        game.reloadCards()
        // Сброс таймера
        this.timer.reload()
        // Установка слушателя первого клика, запускающего таймер
        this.timer.setStartClickListener(list)
        // Скрытие модальных окон после завершения подготовки новой игры
        setTimeout(() => {
            if (!this.modalWin.classList.contains("js-hidden")) {
                this.modalWin.classList.add("js-hidden")
            } else {
                this.modalLose.classList.add("js-hidden")
            }
        }, 1500)
    }
}

let game = new Game()
game.initFirstSession(cardButtonsCollection)


