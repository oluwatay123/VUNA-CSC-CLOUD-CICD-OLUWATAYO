(function payment() {
    // Document elements
    const d = document,
          body = d.body,
          ppForm = d.forms[0],
          ccForm = d.forms[1],
          ecForm = d.forms[2],
          cCard = d.querySelector('#cc-card'),
          pCard = d.querySelector('#pp-card'),
          eCard = d.querySelector('#ec-card'),
          info = d.querySelector('#choosen-paymenttype'),
          ccNumber = ccForm.querySelector('#cardnumber'),
          cNumber = d.querySelectorAll('.card-number span'),
          ccName = ccForm.querySelector('#cardholder'),
          cName = d.querySelectorAll('.card-holder span'),   
          ccMonth = ccForm.querySelector('#expires-month'),
          cMonth = d.querySelectorAll('.e-month span'),
          ccYear = ccForm.querySelector('#expires-year'),
          cYear = d.querySelectorAll('.e-year span'),
          ccCCV = ccForm.querySelector('#ccv'),
          cCCV = d.querySelector('.ccv strong'),
          ccCard = d.querySelector('.credit-card-type');

    const defaultNumber = cNumber[0].innerHTML,
          defaultName = cName[0].innerHTML;

    init();

    function init() {
        body.className = 'cc-bg';

        function switchPos(elm) {
            if (elm.classList.contains('selected')) {
                if (elm.querySelector('input')) {
                    elm.querySelector('input').focus();
                }
                return;
            }
            const selected = d.querySelector('.selected');
            if (selected) {
                selected.classList.remove('selected');
                selected.classList.add(elm.classList.contains('unselected-left') ? 'unselected-left' : 'unselected-right');
            }
            elm.classList.add('selected');
            elm.classList.remove('unselected-left', 'unselected-right');
            if (window.matchMedia("(max-width: 1039px)").matches) {
                setTimeout(() => elm.scrollIntoView(), 500);
            }
        }

        function addEventListeners() {
            pCard.addEventListener('click', () => {
                switchPos(d.querySelector('.paymenttype.pp'));
                body.className = 'pp-bg';
                info.innerHTML = 'PayPal';
            });

            cCard.addEventListener('click', () => {
                switchPos(d.querySelector('.paymenttype.cc'));
                body.className = 'cc-bg';
                info.innerHTML = 'Credit Card';
            });

            eCard.addEventListener('click', () => {
                switchPos(d.querySelector('.paymenttype.ec'));
                body.className = 'ec-bg';
                info.innerHTML = 'Bank account';
            });

            ccNumber.addEventListener('focus', () => cNumber[0].classList.add('glow'));
            ccNumber.addEventListener('blur', () => cNumber[0].classList.remove('glow'));

            ccName.addEventListener('focus', () => cName[0].classList.add('glow'));
            ccName.addEventListener('blur', () => cName[0].classList.remove('glow'));

            ccMonth.addEventListener('focus', () => cMonth[0].classList.add('glow'));
            ccMonth.addEventListener('blur', () => cMonth[0].classList.remove('glow'));

            ccYear.addEventListener('focus', () => cYear[0].classList.add('glow'));
            ccYear.addEventListener('blur', () => cYear[0].classList.remove('glow'));

            ccCCV.addEventListener('focus', () => cCard.classList.add('flipped'));
            ccCCV.addEventListener('blur', () => cCard.classList.remove('flipped'));

            ccNumber.addEventListener('keyup', handleCardNumberInput);
            ccName.addEventListener('keyup', handleCardNameInput);
            ccMonth.addEventListener('keyup', handleCardMonthInput);
            ccYear.addEventListener('keyup', handleCardYearInput);
            ccCCV.addEventListener('keyup', handleCardCCVInput);
        }

        function handleCardNumberInput() {
            let cardNumber = this.value.replace(/[^0-9\s]/g, '');
            if (this.value.match(/[^0-9\s]/g)) {
                this.value = cardNumber;
            }
            const cardType = getCardType(cardNumber.replace(/\s/g, ''));
            let parts = [];
            switch (cardType) {
                case 'amex':
                    parts = numSplit(cardNumber.replace(/\s/g, ''), [4, 6, 5]);
                    ccCard.className = 'credit-card-type amex';
                    break;
                case 'mastercard':
                    parts = numSplit(cardNumber.replace(/\s/g, ''), [4, 4, 4, 4]);
                    ccCard.className = 'credit-card-type mastercard';
                    break;
                case 'visa':
                    parts = numSplit(cardNumber.replace(/\s/g, ''), [4, 4, 4, 4]);
                    ccCard.className = 'credit-card-type visa';
                    break;
                default:
                    parts = cardNumber.split(' ');
                    ccCard.className = 'credit-card-type';
            }
            cardNumber = parts.join(' ');
            if (cardNumber !== this.value) {
                this.value = cardNumber;
            }
            syncText(cNumber, cardNumber || defaultNumber);
        }

        function handleCardNameInput() {
            let cardName = this.value.replace(/[^a-zA-Z-\.\s]/g, '');
            if (cardName !== this.value) {
                this.value = cardName;
            }
            syncText(cName, cardName || defaultName);
        }

        function handleCardMonthInput(ev) {
            let month = this.value.replace(/[^0-9]/g, '');
            if (ev.keyCode === 38) {
                month = parseInt(month) || 0;
                month = (month < 9) ? '0' + (month + 1) : (month + 1).toString();
            } else if (ev.keyCode === 40) {
                month = parseInt(month) || 13;
                month = (month > 10) ? (month - 1).toString() : '0' + (month - 1);
                if (month === '00') month = '01';
            }
            month = Math.max(1, Math.min(12, parseInt(month))).toString().padStart(2, '0');
            this.value = month;
            syncText(cMonth, month);
        }

        function handleCardYearInput(ev) {
            const currentYear = new Date().getFullYear().toString().substr(2, 2);
            let year = this.value.replace(/[^0-9]/g, '');
            if (ev.keyCode === 38) {
                year = parseInt(year) || parseInt(currentYear);
                year++;
            } else if (ev.keyCode === 40) {
                year = parseInt(year) || (parseInt(currentYear) + 5);
                year--;
            }
            year = Math.max(parseInt(currentYear), Math.min(parseInt(currentYear) + 5, year)).toString();
            this.value = year;
            syncText(cYear, year);
        }

        function handleCardCCVInput() {
            let cardCCV = this.value.replace(/[^0-9]/g, '');
            if (cardCCV !== this.value) {
                this.value = cardCCV;
            }
            cCCV.innerHTML = cardCCV;
        }

        addEventListeners();
    }

    function syncText(elements, text) {
        elements.forEach(el => el.innerHTML = text);
    }

    function numSplit(number, indexes) {
        const parts = [];
        for (let i = 0; i < indexes.length; i++) {
            parts.push(number.slice(0, indexes[i]));
            number = number.slice(indexes[i]);
        }
        return parts;
    }

    function getCardType(number) {
        if (/^5[1-5]/.test(number)) return 'mastercard';
        if (/^3[47]/.test(number)) return 'amex';
        if (/^4/.test(number)) return 'visa';
        return '';
    }
})();
