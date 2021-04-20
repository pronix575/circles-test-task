class Store {
  constructor(data) {
    this.data = data;
    this.subscribers = [];
  }

  subscribe(callback) {
    if (callback) {
      this.subscribers.push(callback);
    }
  }

  unsubscribe() {
    this.subscribers = [];
  }

  update(callback) {
    if (callback) {
      this.data = callback(this.data);
    }

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
  getCircle(id, color, radius) {
    return `<div class="circle" id="circle-${id}" style="background: ${color}; width: ${
      radius * 2
    }px; height: ${radius * 2}px"></div>`;
  },
  getCirclesContainer(circlesTemp) {
    return `<div id="circles-container">${circlesTemp}</div>`;
  },
};

function renderCircles(circles, n) {
  return circles
    .map((elem) => {
      const computedRadius = Math.round((window.innerWidth * 0.4) / n);
      return templates.getCircle(
        elem.id,
        elem.cssColorStyle,
        computedRadius > 120 ? 120 : computedRadius
      );
    })
    .join(``);
}

function circlesScript(rootId) {
  const rootElement = document.getElementById(rootId);
  if (!rootElement) return;

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
    if (!n) return;

    const circlesStore = new Store(createCircles(n));

    circlesStore.subscribe((data) => {
      rootElement.innerHTML = templates.getCirclesContainer(
        renderCircles(data, n)
      );
    });

    circlesStore.update();
  };
}

circlesScript("root");
