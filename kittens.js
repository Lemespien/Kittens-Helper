const huntAll = document.querySelector("#fastHuntContainerCount");
const praise = document.querySelector('a[data-reactid=".0.3.0"]');

const cultureResource = document.querySelector('div[data-reactid=".0.0.1.1.d.2"]');
const catPower = document.querySelector('[data-reactid=".0.0.1.1.b.2"]');
const catPowerMax = document.querySelector('[data-reactid=".0.0.1.1.b.3"]');
const titanium = document.querySelector('[data-reactid=".0.0.1.1.5.2"]');
const titaniumMax = document.querySelector('[data-reactid=".0.0.1.1.5.3"]');
const oil = document.querySelector('[data-reactid=".0.0.1.1.7.2"]');
const oilMax = document.querySelector('[data-reactid=".0.0.1.1.7.3"]');

const Resources = new Map();
const Embassies = new Map();
const Traders = new Map();

class Resource {
    constructor(name, element) {
        this.name = name;
        this.element = element;
        this.automate = false;
    }

    flipAutomate() {
        this.automate = !this.automate;
    }
}

class CraftingClass extends Resource {
    constructor(name, element, id = null) {
        super(name, element);
        this.id = id;
        Resources.set(name, this);
    }
}

class TraderClass extends Resource {
    constructor(name, element) {
        super(name, element);
        Traders.set(name, this);
    }
}

class EmbassyClass extends Resource {
    constructor(name, element, index) {
        super(name, element);
        this.index = index;
        this.element = this;
        Embassies.set(name, this);
    }

    click() {
        document.querySelectorAll(".panelContainer")[this.index].querySelectorAll(".btnContent")[1].click();
    }
}
CraftingClass.interval = null;
CraftingClass.intervalTime = 15000;

TraderClass.interval = null;
TraderClass.intervalTime = 5000;

EmbassyClass.interval = null;
EmbassyClass.intervalTime = 5000;

document.querySelector(".Trade").click();

new CraftingClass("explorers", document.querySelector(".explore"));

const tradingArray = Array.from(document.querySelectorAll(".panelContainer"));

tradingArray.forEach((element, index) => {
    let traderName = element.querySelector(".title").innerText.split(" ")[0].toLowerCase(); // "Lizard Friendly".split(" ")
    let traderAll = element.querySelector(".btnContent a");
    new EmbassyClass(traderName + "_embassy", element, index);
    new TraderClass(traderName, traderAll);
});

//document.querySelectorAll(".panelContainer")[1].querySelectorAll(".btnContent")[1].click(); EmbassyClass upgrades... uncachable atm

const craftingArray = Array.from(document.querySelectorAll(".craft"));

craftingArray.forEach((element, index) => {
    const name = element.querySelector(".resource-name").innerText;
    const resourceElement = element.querySelector(".all");
    const id = resourceElement.dataset.reactid;

    new CraftingClass(name, resourceElement, id);
});

const Praise = new CraftingClass("praise", praise);

const Hunt = new CraftingClass("hunt", huntAll); // this has to be last, since it's an ordered list

const CraftingKeys = Array.from(Resources.values());

CraftingKeys.map((element, index) => {
    if (!element) return;
    if (element.name == "steel") {
        const plate = CraftingKeys[index - 1];
        CraftingKeys[index - 1] = element;
        CraftingKeys[index] = plate;
    }
});

const TraderKeys = Array.from(Traders.values());
const EmbassyKeys = Array.from(Embassies.values());

let craftingInterval;
let tradingInterval;
let embassyInterval;
let huntInterval;
let praiseInterval;

function automatedFunction(arr) {
    try {
        arr.forEach((key) => {
            if (key.automate && key.element) {
                if (specialAction(key, "hunt", catPower, catPowerMax, 0.5)) return;
                if (specialAction(key, "alloy", titanium, titaniumMax, 0.75)) return;
                if (specialAction(key, "kerosene", oil, oilMax, 0.75)) return;
                key.element.click();
                if (key.name == "explorers" && document.querySelectorAll("span.msg")[1].innerText.search("Your explorers failed to find anyone.") >= 0) {
                    document.querySelector(`#leme_${key.name}_id`).click();
                }
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function startInterval(controller, arr) {
    console.log("Starting automatic", controller);
    controller.interval = setInterval(automatedFunction, controller.intervalTime, arr);
}

function stopInterval(controller) {
    console.log("Stopping automatic", controller);
    clearInterval(controller.interval);
    controller.interval = null;
}

function specialAction(key, resourceName, current, max, threshold) {
    if (key.name == resourceName && replaceNotation(current) < threshold * replaceNotation(max)) {
        return true;
    }
    return false;
}

function replaceNotation(current) {
    let multiplyBy = 1;
    if (current.innerText.search("K") >= 0) {
        multiplyBy = 1000;
    } else if (current.innerText.search("M") >= 0) {
        multiplyBy = 1000000;
    }
    let newCurrent = current.innerText.replace("/", "");
    return parseInt(newCurrent) * multiplyBy;
}


let observeInterval = setInterval(() => {
    if (document.querySelector("#observeBtn"))
        document.querySelector("#observeBtn").click();
}, 3000) // a day is roughly 3 sec

const myDiv = document.createElement("div");
myDiv.style.position = "fixed";
myDiv.style.right = "50px";
myDiv.style.top = "50px";

function createIntervalBoxes(name, controller, arr) {
    const sectionContainer = document.createElement("div");

    const AutoCheckBox = document.createElement("input");
    AutoCheckBox.type = "checkBox";
    AutoCheckBox.name = name;
    AutoCheckBox.value = false;
    AutoCheckBox.id = `leme_${name}_id`;

    const AutoCheckBoxLabel = document.createElement("label");
    AutoCheckBoxLabel.htmlFor = AutoCheckBox.id;
    AutoCheckBoxLabel.appendChild(document.createTextNode(name));

    AutoCheckBox.addEventListener("click", () => {
        if (controller.interval) stopInterval(controller);
        else startInterval(controller, arr);
    });

    const IntervalTimeInput = document.createElement("input");
    IntervalTimeInput.type = "number";
    IntervalTimeInput.value = controller.intervalTime;
    IntervalTimeInput.onchange = (() => {
        controller.intervalTime = IntervalTimeInput.value;
        console.log(controller.intervalTime);
    });

    IntervalTimeInput.style.width = "75px";
    IntervalTimeInput.style.margin = "0 0 0 5px";

    sectionContainer.appendChild(AutoCheckBox);
    sectionContainer.appendChild(AutoCheckBoxLabel);
    sectionContainer.appendChild(IntervalTimeInput);

    sectionContainer.style.margin = "10px";

    myDiv.appendChild(sectionContainer);

    arr.forEach((resource) => {
        createCheckBox(resource, sectionContainer);
    });
}

function createCheckBox(resource, container) {
    const checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    checkBox.name = resource.name;
    checkBox.value = resource.automate;
    checkBox.id = `leme_${resource.name}_id`;

    const checkBoxLabel = document.createElement("label");
    checkBoxLabel.htmlFor = checkBox.id;
    checkBoxLabel.appendChild(document.createTextNode(`${resource.name}`));
    checkBox.addEventListener("click", () => {
        resource.flipAutomate();
    });

    let div = document.createElement("div");

    div.appendChild(checkBox);
    div.appendChild(checkBoxLabel);

    container.appendChild(div);
}

createIntervalBoxes("Automate", CraftingClass, CraftingKeys);
createIntervalBoxes("Trading", TraderClass, TraderKeys);
createIntervalBoxes("Embassies", EmbassyClass, EmbassyKeys);

document.body.appendChild(myDiv);
