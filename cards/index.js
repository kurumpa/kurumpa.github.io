const suits = "HDCS".split("")
const faces = new Array(9)
    .fill(0).map((_, i) => i + 2)
    .concat("JQKA".split(""))
const ids = Array.prototype.concat.apply([], suits.map(s => faces.map(f => `${f}${s}`)))
const cards = ids.map(id => ({
    id,
    stack: "0",
    face: "0"
}))

shuffle(cards)

function pew () {
    render(cards.map(c => ({...c, stack: "1", face: "1"})))
}
setTimeout(() => render(cards), 100)

const app = document.getElementById("app")
async function render (cards) {
    for (let i = 0; i < cards.length; i += 1) {
        const cardData = cards[i]
        let card = document.getElementById(`card_${cardData.id}`)
        if (!card) {
            card = document.createElement("div")
            card.setAttribute("id", `card_${cardData.id}`)
            card.classList.add("card")
            card.classList.add("face-0")
            card.classList.add("stack-0")
            const front = document.createElement("div")
            front.classList.add("front")
            front.style.backgroundImage = `url("PNG/${cardData.id}.png")`
            const back = document.createElement("div")
            back.classList.add("back")
            card.appendChild(front)
            card.appendChild(back)
            app.appendChild(card)
        }
        card.style.zIndex = i
        await updateState(card, cardData)
    }
    console.log("render done")
    
}

async function updateState (card, cardData) {

    let resolver
    const asnc = new Promise(resolve => { resolver = resolve })
    const end = () => {
        card.removeEventListener("transitionend", end)
        resolver()
        console.log("transition done")
    }
    let animationStarted = false
    card.addEventListener("transitionend", end)
    ;[].concat.apply([], card.classList).forEach(cls => {
        const stack = /stack-(\d+)/.exec(cls)
        if (stack && stack[1] !== cardData.stack) {
            animationStarted = true
            card.classList.remove(cls)
            card.classList.add(`stack-${cardData.stack}`)
        }
        const face = /face-(\d+)/.exec(cls)
        if (face && face[1] !== cardData.face) {
            animationStarted = true
            card.classList.remove(cls)
            card.classList.add(`face-${cardData.face}`)
        }
    })
    if (!animationStarted) {
        end()
    }

    return asnc
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}
