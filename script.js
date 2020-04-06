import keys from './src/data.js';

class KeyBoard {
  constructor() {
    this.ruUpperCase = keys.ruUpperCase;
    this.ruLowerCase = keys.ruLowerCase;
    this.engUpperCase = keys.engUpperCase;
    this.engLowerCase = keys.engLowerCase;
    this.keyCode = keys.keyCode;
    this.capsMode = false;
  }

  init() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('clearFix');
    this.wrapper.id = 'wrapper';
    document.body.prepend(this.wrapper);

    this.form = document.createElement('form');
    this.textArea = document.createElement('textarea');
    this.textArea.setAttribute('autofocus', '');
    this.form.prepend(this.textArea);
    document.body.prepend(this.form);

    this.infoText = document.createElement('p');
    this.infoText.innerHTML = 'Created in WINDOWS 10 <br> Shift + Alt - to change the language';
    this.button = document.createElement('button');
    this.button.textContent = 'clear input field';
    document.body.append(this.button);
    document.body.append(this.infoText);
  }

  addDomElements() {
    this.capsLock = document.querySelector('.CapsLock');
    this.upperCaseKey = document.querySelectorAll('.off');
    this.lowerCaseKey = document.querySelectorAll('.on');
    this.rightShift = document.querySelector('.ShiftRight');
    this.leftShift = document.querySelector('.ShiftLeft');
    this.rusKeys = document.querySelectorAll('.activeKeys');
    this.engKeys = document.querySelectorAll('.disableKeys');
  }

  addKeysListener() {
    window.addEventListener('keydown', (e) => this.keyDown(e));
    window.addEventListener('keyup', (e) => this.keyUp(e));
    this.wrapper.addEventListener('click', (e) => this.mouseClick(e));
    this.leftShift.addEventListener('mousedown', () => this.caseUpper());
    this.rightShift.addEventListener('mousedown', () => this.caseUpper());
    this.leftShift.addEventListener('mouseup', () => this.caseLower());
    this.rightShift.addEventListener('mouseup', () => this.caseLower());
    this.button.addEventListener('click', () => this.clearInput());
    this.textArea.addEventListener('blur', () => {
      this.textArea.focus();
    });
    window.addEventListener('blur', () => {
      document.querySelectorAll('.activeKeyBoard').forEach((item) => item.classList.remove('activeKeyBoard'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.altKey) {
        if (localStorage.getItem('language') === 'RU') {
          this.engCase();
        } else {
          this.rusCase();
        }
      }
    });
  }

  addVirtualKeys() {
    for (let i = 0; i < 64; i += 1) {
      const key = document.createElement('div');
      key.classList.add('key');
      key.classList.add(this.keyCode[i]);
      this.wrapper.append(key);

      const ruKey = document.createElement('div');
      ruKey.classList.add('activeKeys');
      this.wrapper.lastChild.append(ruKey);

      const engKey = document.createElement('div');
      engKey.classList.add('disableKeys');
      this.wrapper.lastChild.append(engKey);

      const ruKeyUpper = document.createElement('span');
      ruKeyUpper.classList.add('off');
      ruKeyUpper.innerHTML = this.ruUpperCase[i];
      this.wrapper.lastChild.firstChild.append(ruKeyUpper);

      const ruKeyLower = document.createElement('span');
      ruKeyLower.classList.add('on');
      ruKeyLower.innerHTML = this.ruLowerCase[i];
      this.wrapper.lastChild.firstChild.append(ruKeyLower);

      const engKeyUpper = document.createElement('span');
      engKeyUpper.classList.add('off');
      engKeyUpper.innerHTML = this.engUpperCase[i];
      this.wrapper.lastChild.lastChild.append(engKeyUpper);

      const engKeyLower = document.createElement('span');
      engKeyLower.classList.add('on');
      engKeyLower.innerHTML = this.engLowerCase[i];
      this.wrapper.lastChild.lastChild.append(engKeyLower);

      if (i === 14 || i === 29 || i === 42 || i === 55) {
        key.classList.add('float-none');
      }
    }
  }

  checkKey(str) {
    switch (str) {
      case 'Enter':
        this.textArea.value += '\n';
        break;
      case 'Tab':
        this.textArea.value += '\t';
        break;
      case 'Backspace':
        this.deleteSymbolPrev();
        break;
      case 'Delete':
        this.deleteSymbolNext();
        break;
      case 'Del':
        this.deleteSymbolNext();
        break;
      case 'ArrowLeft':
        this.arrowMove('ArrowLeft');
        break;
      case 'ArrowRight':
        this.arrowMove('ArrowRight');
        break;
      case 'ArrowUp':
        this.arrowMove('ArrowUp');
        break;
      case 'ArrowDown':
        this.arrowMove('ArrowDown');
        break;
      case 'CapsLock':
        this.changeCase();
        break;
      default:
    }
  }

  mouseClick(e) {
    const target = e.target.closest('.key');
    if (target == null) {
      return;
    }
    const targetKey = target.className.split(' ')[1];
    this.checkKey(targetKey);
    target.classList.add('active');
    setTimeout(() => {
      target.classList.remove('active');
    }, 500);
    const text = e.target.closest('.key').querySelector('.on').textContent;
    if (text.length > 1) {
      return;
    }
    this.textArea.value += text;
  }

  keyDown(e) {
    e.preventDefault();
    if (e.code === 'CapsLock') {
      this.changeCase();
      return;
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftLeft') {
      this.caseUpper();
    }
    this.checkKey(e.code);
    const key = document.querySelector(`.${e.code}`);
    if (key === null) {
      return;
    }
    key.classList.add('activeKeyBoard');
    const text = document.querySelector(`.${e.code}`).querySelector('.on').textContent;
    if (text.length > 1) {
      return;
    }
    this.textArea.value += text;
  }

  keyUp(e) {
    if (e.code === 'CapsLock') {
      return;
    }
    const key = document.querySelector(`.${e.code}`);
    if (key === null) {
      return;
    }
    key.classList.remove('activeKeyBoard');
    if (e.key === 'Shift') {
      if (this.capsMode === true) {
        return;
      }
      this.caseLower(e);
    }
  }

  changeCase() {
    if (this.capsMode === true) {
      this.capsLock.style.backgroundColor = 'rgb(201, 201, 201)';

      this.capsMode = false;
      this.caseLower();
    } else if (this.capsMode === false) {
      this.capsLock.style.backgroundColor = 'rgb(164, 164, 255)';
      this.capsMode = true;
      this.caseUpper();
    }
  }

  caseUpper() {
    this.lowerCaseKey.forEach((item) => item.classList.remove('on'));
    this.lowerCaseKey.forEach((item) => item.classList.add('off'));
    this.upperCaseKey.forEach((item) => item.classList.remove('off'));
    this.upperCaseKey.forEach((item) => item.classList.add('on'));
  }

  caseLower() {
    this.lowerCaseKey.forEach((item) => item.classList.remove('off'));
    this.lowerCaseKey.forEach((item) => item.classList.add('on'));
    this.upperCaseKey.forEach((item) => item.classList.remove('on'));
    this.upperCaseKey.forEach((item) => item.classList.add('off'));
  }

  deleteSymbolPrev() {
    const cursorNum = this.textArea.selectionStart;
    if (cursorNum === 0) {
      return;
    }
    const string = this.textArea.value;
    this.textArea.value = string.slice(0, cursorNum - 1) + string.slice(cursorNum, string.length);
    this.textArea.selectionStart = cursorNum - 1;
    this.textArea.selectionEnd = cursorNum - 1;
  }

  deleteSymbolNext() {
    const cursorNum = this.textArea.selectionStart;
    if (cursorNum === this.textArea.value.length) {
      return;
    }
    const string = this.textArea.value;
    this.textArea.value = string.slice(0, cursorNum) + string.slice(cursorNum + 1, string.length);
    this.textArea.selectionStart = cursorNum;
    this.textArea.selectionEnd = cursorNum;
  }

  arrowMove(direction) {
    const cursor = this.textArea.selectionStart;
    if (direction === 'ArrowRight') {
      this.textArea.selectionStart = cursor + 1;
      this.textArea.selectionEnd = cursor + 1;
    } else if (direction === 'ArrowLeft') {
      if (cursor === 0) {
        return;
      }
      this.textArea.selectionStart = cursor - 1;
      this.textArea.selectionEnd = cursor - 1;
    } else if (direction === 'ArrowUp') {
      this.textArea.selectionStart = 0;
      this.textArea.selectionEnd = 0;
    } else if (direction === 'ArrowDown') {
      this.textArea.selectionStart = -1;
      this.textArea.selectionEnd = -1;
    }
  }

  rusCase() {
    this.rusKeys.forEach((item) => item.classList.remove('disableKeys'));
    this.rusKeys.forEach((item) => item.classList.add('activeKeys'));
    this.engKeys.forEach((item) => item.classList.remove('activeKeys'));
    this.engKeys.forEach((item) => item.classList.add('disableKeys'));
    localStorage.setItem('language', 'RU');
  }

  engCase() {
    this.rusKeys.forEach((item) => item.classList.remove('activeKeys'));
    this.rusKeys.forEach((item) => item.classList.add('disableKeys'));
    this.engKeys.forEach((item) => item.classList.remove('disableKeys'));
    this.engKeys.forEach((item) => item.classList.add('activeKeys'));
    localStorage.setItem('language', 'ENG');
  }

  checkLanguage() {
    if (localStorage.getItem('language') === 'ENG') {
      this.engCase();
    } else {
      this.rusCase();
    }
  }

  clearInput() {
    this.textArea.value = '';
  }
}

window.onload = () => {
  const virtualKeyBoard = new KeyBoard();
  virtualKeyBoard.init();
  virtualKeyBoard.addVirtualKeys();
  virtualKeyBoard.addDomElements();
  virtualKeyBoard.addKeysListener();
  virtualKeyBoard.checkLanguage();
};
