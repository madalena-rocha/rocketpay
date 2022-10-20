import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
// selecionando no svg da classe cc-bg o path do primeiro g dentro do g de primeiro nível
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  // funcionalidade que recebe dois argumentos, o primeiro é o nome do atributo que deseja modificar, e o segundo é o novo valor do atributo
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType
// colocando a função setCardType no globalThis (Window)

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      // new Date().getFullYear() retorna o ano atual
      // String.slice(2) para transformar em string e selecionar os dois últimos caracteres
      to: String(new Date().getFullYear() + 10).slice(2), // ano atual mais 10 anos
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      // Inicia com 4 seguido de 0 ou mais 15 dígitos
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      /*
        Inicia com 5, seguido de 0 um dígito entre 1 e 5, seguido de 0 ou mais 2 dígitos
        OU
        Inicia com 22, seguido de um dígito entre 2 e 9, seguido de 0 ou mais 1 dígito
        OU
        Inicia com 2, seguido de um dígito entre 3 e 7, seguido de 0 ou mais 2 dígitos
        Seguido de 0 ou mais 12 dígitos
      */
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    // sempre que clicar no teclado, a função será executada
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    // pega o valor do dynamicMasked e concatena com o número digitado
    // se a tecla pressionada não for dígito, troca por vazio
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    // verifica se o número está de acordo com o regex

    // compiledMasks pega todo o array de masks
    // find procura no array de máscaras
    // se o retorno da função passada no find for verdadeiro, encontrou o elemento e retorna o elemento, se for falso, retorna undefined
    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
  // garantir que mesmo quando apagar o nome do titular continue o Fulano da Silva
  // se o tamanho do conteúdo for 0, mostra Fulano da Silva, se não, mostra o conteúdo
})

securityCodeMasked.on("accept", () => {
  // o primeiro parâmetro é quando deseja capturar o conteúdo
  // observa o input onde o CVC é digitado e, se aceito, ou seja, se o conteúdo digitado for válido, executa a função
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  // saber qual o tipo do cartão selecionado
  setCardType(cardType)
  updatecardNumber(cardNumberMasked.value)
})

function updatecardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")

  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value")

  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
