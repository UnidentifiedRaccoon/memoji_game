export default class FlipCard {
    constructor(ButtonElement, type, id) {
        this.button = ButtonElement;
        this.setType(type);
        this.setId(id);
    }

    setType (type) {
        this.button.setAttribute('data-js-type', type);
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
