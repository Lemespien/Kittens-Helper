const huntAll = document.querySelector("#fastHuntContainerCount");
const praise = document.querySelector('a[data-reactid=".0.3.0"]');



/* Trading */
// let tradingArray = Array.from(document.querySelectorAll(".title"));

// let myFilteredArray = tradingArray.filter((element, index) => {
//     if (element.innerText.search("Zebra") >= 0) {
//         return { index, element };
//     }
// })


// Can grab .craft class for these to automate it
//let craftingArr = Array.from(document.querySelectorAll(".craft")) -> nodeList - converted to array.
// .querySelector(".resource-name").innerText should return resource name
// on each of them .querySelector(".all"); -> this should return the "all" link element

/* Resources */
// const woodAll = document.querySelector('div[data-reactid=".0.5.1.0.0.6.0"]');
// const beamAll = document.querySelector('div[data-reactid=".0.5.1.0.2.6.0"]');
// const slabAll = document.querySelector('div[data-reactid=".0.5.1.0.3.6.0"]');
// const plateAll = document.querySelector('div[data-reactid=".0.5.1.0.4.6.0"]');
// const steelAll = document.querySelector('div[data-reactid=".0.5.1.0.5.6.0"]');
// const alloyAll = document.querySelector('[data-reactid=".0.5.1.0.8.6.0"]');
// const keroseneAll = document.querySelector('[data-reactid=".0.5.1.0.d.6.0"]');
// const parchmentAll = document.querySelector('div[data-reactid=".0.5.1.0.e.6.0"]');
// const manuscriptAll = document.querySelector('div[data-reactid=".0.5.1.0.f.6.0"]');
// const compendiumAll = document.querySelector('div[data-reactid=".0.5.1.0.g.6.0"]');

const cultureResource = document.querySelector('div[data-reactid=".0.0.1.1.d.2"]');
const catPower = document.querySelector('[data-reactid=".0.0.1.1.b.2"]');
const catPowerMax = document.querySelector('[data-reactid=".0.0.1.1.b.3"]');
const titanium = document.querySelector('[data-reactid=".0.0.1.1.5.2"]');
const titaniumMax = document.querySelector('[data-reactid=".0.0.1.1.5.3"]');
const oil = document.querySelector('[data-reactid=".0.0.1.1.7.2"]');
const oilMax = document.querySelector('[data-reactid=".0.0.1.1.7.3"]');

const Resources = new Map();

class CraftingResource {
    constructor(name, element) {
        this.name = name;
        this.element = element;
        Resources.set(this, false);
    }
}

document.querySelector(".Trade").click();
// this returns a list of all trade buttons + send explorers
let tradingArray = Array.from(document.querySelectorAll(".btnContent")).filter((element, index) => {
    if (index % 2 == 0) {
        console.log(element);
        return element;
    }
});

tradingArray.forEach((element, index) => {
    if (index == tradingArray.length - 1) {
        // if explorers -> it's only got 1 button
        new CraftingResource("Explorers", element.children[0]);
        return;
    }

    let traderName = tradingArray[index].parentElement.parentElement.parentElement.parentElement.children[1].innerText.split(" ")[0]
    new CraftingResource(traderName, element.children[1]);
});

let craftingArray = Array.from(document.querySelectorAll(".craft"));

craftingArray.forEach((element, index) => {
    new CraftingResource(element.querySelector(".resource-name").innerText, element.querySelector(".all"));
});

const Praise = new CraftingResource("Praise", praise);

const Hunt = new CraftingResource("Hunt", huntAll); // this has to be last, since it's an ordered list

let ObjectKeys = Array.from(Resources.keys());

let craftingInterval;

function startInterval() {
    console.log("Starting automatic crafting");
    craftingInterval = setInterval(() => {
        try {
            ObjectKeys.forEach((key) => {
                if (Resources.get(key) && key.element) {
                    if (specialAction(key, "Hunt", catPower, catPowerMax, 0.5)) return;
                    if (specialAction(key, "Alloy", titanium, titaniumMax, 0.75)) return;
                    if (specialAction(key, "Kerosene", oil, oilMax, 0.75)) return;
                    key.element.click();
                    // Check if any there are more civilizations to discover
                    if (key.name == "Explorers" && document.querySelectorAll("span.msg")[1].innerText.search("Your explorers failed to find anyone.") >= 0) {
                        document.querySelector(`#leme_${key.name}_id`).click();
                    }
                }
            });
        } catch (err) {
            console.log(err)
        }
        //if (cultureResource.innerHTML > 2400) manuscriptAll.click();
    }, 15000);
}

function specialAction(key, resourceName, current, max, threshold) {
    if (key.name == resourceName && replaceNotation(current) < threshold * replaceNotation(max)) {
        return true;
    }
    return false;
}

function replaceNotation(current) {
    let multiplyBy = 1;
    if (current.innerText.search("K")) {
        multiplyBy = 1000;
    } else if (current.innerText.search("M")) {
        multiplyBy = 1000000;
    }
    let newCurrent = current.innerText.replace("/", "");
    return parseInt(newCurrent) * multiplyBy;
}

function stopInterval() {
    console.log("Stopping automatic crafting");

    clearInterval(craftingInterval);
    craftingInterval = null;
}


let observeInterval = setInterval(() => {
    if (document.querySelector("#observeBtn"))
        document.querySelector("#observeBtn").click();
}, 3000) // a day is roughly 3 sec

const myDiv = document.createElement("div");
myDiv.style.position = "fixed";
myDiv.style.right = "50px";
myDiv.style.top = "50px";

let checkBoxArray = [];
let checkBoxAndLabelArray = [];

ObjectKeys.forEach((resource) => {
    createCheckBox(resource);
})

const AutoCheckBox = document.createElement("input");
AutoCheckBox.type = "checkBox";
AutoCheckBox.name = "Automate";
AutoCheckBox.value = false;
AutoCheckBox.id = `leme_automate_id`;

const AutoCheckBoxLabel = document.createElement("label");
AutoCheckBoxLabel.htmlFor = AutoCheckBox.id;
AutoCheckBoxLabel.appendChild(document.createTextNode("Automate"));

AutoCheckBox.addEventListener("click", () => {
    if (craftingInterval) stopInterval();
    else startInterval();
});

myDiv.appendChild(AutoCheckBox);
myDiv.appendChild(AutoCheckBoxLabel);


function createCheckBox(resource) {
    const checkBox = document.createElement("input");
    checkBox.type = "checkBox";
    checkBox.name = resource.name;
    checkBox.value = Resources.get(resource);
    checkBox.id = `leme_${resource.name}_id`;

    const checkBoxLabel = document.createElement("label");
    checkBoxLabel.htmlFor = checkBox.id;
    checkBoxLabel.appendChild(document.createTextNode(`${resource.name}`));
    checkBoxArray.push(checkBox);
    checkBoxAndLabelArray.push([checkBox, checkBoxLabel]);
    checkBox.addEventListener("click", () => {
        Resources.set(resource, checkBox.checked);
    });
}

checkBoxAndLabelArray.forEach(([box, label]) => {
    let div = document.createElement("div");
    console.log(box, label);
    div.appendChild(box);
    div.appendChild(label);
    myDiv.appendChild(div);
});

document.body.appendChild(myDiv);
