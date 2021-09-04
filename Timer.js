let timerElement = document.querySelector('.timer')

export default class Timer {
    constructor(game) {
        // Передача объекта game необходима для вызова
        // метода game.lose() как callback функции в случае проигрыша
        this.game = game;
        this.minutesElement = timerElement.children[0]
        this.secondsElement = timerElement.children[2]
    }

    setStartClickListener(list) {
        let _this = this
        function timerStartClickHandler(event) {
            if (event.target.classList.contains("flip-card__button")) {
                _this.start()
                list.removeEventListener("click", timerStartClickHandler)
            }
        }
        list.addEventListener("click", timerStartClickHandler)
    }

    start() {
        let currentMin = parseInt(this.minutesElement.textContent);
        let currentSec = parseInt(this.secondsElement.textContent);
        let totalSeconds = currentMin*60 + currentSec;
        let _this = this;


        this._clearIntervalTag = setInterval(function () {
            // Уменьшение таймера на секунду
            let currentMin = (Math.floor(totalSeconds / 60)).toString()
            let currentSec = (Math.floor(totalSeconds % 60)).toString()

            _this.minutesElement.textContent = (currentMin.length === 2) ? currentMin : "0" + currentMin;
            _this.secondsElement.textContent = (currentSec.length === 2) ? currentSec : "0" + currentSec;
            totalSeconds--;
            // Если время на таймере закончилось,
            // то необходимо остановить таймер
            if (totalSeconds === -1) {
                _this.game.lose()
            }
        }, 1000)
    }

    stop() {
        clearInterval(this._clearIntervalTag)
    }

    reload() {
        this.minutesElement.textContent = '00'
        this.secondsElement.textContent = '40'
    }

}