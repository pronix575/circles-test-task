class Store {
  constructor(data) {
    this.data = data;
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
  }

  unsubscribe() {
    this.subscribers = [];
  }

  update(callback) {
    this.data = callback(this.data);
    this.subscribers.forEach((elem) => elem(this.data));
  }
}

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function getRandomColor() {
  const from = 0,
    to = 255;

  return {
    r: randomInteger(from, to),
    g: randomInteger(from, to),
    b: randomInteger(from, to),
  };
}

class Circle {
  constructor(id) {
    this.id = id;
    this.color = getRandomColor();
  }

  get cssColorStyle() {
    return `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
  }

  get colorSum() {
    return this.color.r + this.color.g + this.color.b;
  }
}

function createCircles(n) {
  const circles = [];

  for (let i = 0; i < n; i++) {
    circles.push(new Circle(i));
  }

  return circles;
}

const templates = {
  startForm: `<div id="start-form">
        <input placeholder="Введите n" type="number" id="start-form__circles-number-input" />
        <button id="start-form__start_button" disabled>Начать</button>
    </div>`,
  getCircle(id, color) {
    return `<div class="circle" id="circle-${id}" style="background: ${color}"></div>`;
  },
  getCirclesContainer(circlesTemp) {
    return `<div id="circles-container">${circlesTemp}</div>`;
  },
};

function renderCircles(circles) {
  return circles
    .map((elem) => templates.getCircle(elem.id, elem.cssColorStyle))
    .join(``);
}

function circlesScript(rootId) {
  const rootElement = document.getElementById(rootId);
  rootElement.innerHTML = templates.startForm;

  const formInput = document.getElementById("start-form__circles-number-input");
  const formButton = document.getElementById("start-form__start_button");

  let n = null;

  formInput.oninput = () => {
    formInput.value =
      formInput.value === ""
        ? ""
        : Number(formInput.value < 0 ? -formInput.value : formInput.value);

    n = Number(formInput.value);

    formButton.disabled = !Boolean(Number(formInput.value));
  };

  formButton.onclick = () => {
    if (n) {
      const circlesStore = new Store(createCircles(n));
      rootElement.innerHTML = templates.getCirclesContainer(
        renderCircles(circlesStore.data)
      );
    }
  };
}

circlesScript("root");
