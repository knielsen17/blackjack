function onStart(event) {
  event.preventDefault();
  document.getElementById("results").innerHTML = "";
  const url = "http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
  fetch(url)
    .then(function(response) {
      if(response.status != 200) {
        return;
      }
      return response.json();
    }).then(function(json) {
      let deckID = json.deck_id;
      newGame(deckID);
  });
}

async function onDraw() {
  event.preventDefault();
  var deckID = document.getElementById("deckID").value;
  await addCardToPlayer(deckID, "playerOne");
  var playerOne = await listPile(deckID, "playerOne");
  var playerOneCards = playerOne.playerOne.cards;
  let playerOneCardsSum = findSum(playerOneCards);
  var picHtml = "";
  for (let i = 0; i < playerOneCards.length; ++i) {
    picHtml += "<img src='" + playerOneCards[i].image + "'/>";
  }
  document.getElementById("oneCardPictures").innerHTML = picHtml;
  document.getElementById("playerOneTotal").innerHTML = "<p>" + playerOneCardsSum + "</p>";
  if (playerOneCardsSum > 21) {
    document.getElementById("results").innerHTML = "<h1>!!!House Wins!!!</h1>";
    document.getElementById("playerOneCardsHead").innerHTML = "<h2>Your Final Cards</h2>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
  }
}

async function onHold(event, deckID) {
  event.preventDefault();
  var deckID = document.getElementById("deckID").value;
  var playerOne = await listPile(deckID, "playerOne");
  var playerOneCards = playerOne.playerOne.cards;
  let playerOneCardsSum = findSum(playerOneCards);
  var house = await listPile(deckID, "house");
  var houseCards = house.house.cards;
  let houseCardsSum = findSum(houseCards);
  document.getElementById("playerOneCardsHead").innerHTML = "<h2>Your Final Cards</h2>";
  document.getElementById("houseCardsHead").innerHTML = "<h2>Dealer's Final Cards</h2>";
  if (houseCardsSum > playerOneCardsSum) {
    //house wins
    document.getElementById("results").innerHTML = "<h1>!!!House Wins!!!</h1>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
  }
  while (houseCardsSum < 17) {
    await addCardToPlayer(deckID, "house");
    house = await listPile(deckID, "house");
    houseCards = house.house.cards;
    houseCardsSum = findSum(houseCards);
  }
  if (houseCardsSum > 21) {
    //house loses
    document.getElementById("results").innerHTML = "<h1>!!!You Win!!!</h1>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
  }
  else if (houseCardsSum > playerOneCardsSum) {
    //house wins
    document.getElementById("results").innerHTML = "<h1>!!!House Wins!!!</h1>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
  }
  else if (houseCardsSum == playerOneCardsSum) {
    //draw
    document.getElementById("results").innerHTML = "<h1>!!!Draw!!!</h1>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
  }
  else {
    //player wins
    document.getElementById("results").innerHTML = "<h1>!!!You win!!!</h1>";
    document.getElementById("buttons").innerHTML = "<form><button id='startGame' class='pure-button pure-button-primary'>Start New Game</button></form>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
  }
}

async function newGame(deckID) {
  var house;
  var houseCards;
  var playerOne;
  var playerOneCards;
  await addCardToPlayer(deckID, "playerOne");
  await addCardToPlayer(deckID, "house");
  await addCardToPlayer(deckID, "playerOne");
  await addCardToPlayer(deckID, "house");
  house = await listPile(deckID, "house");
  houseCards = house.house.cards;
  playerOne = await listPile(deckID, "playerOne");
  playerOneCards = playerOne.playerOne.cards;
  let houseCardsSum = findSum(houseCards);
  let playerOneCardsSum = findSum(playerOneCards);
  document.getElementById("blackJackGame").innerHTML = "<div id='playerOneCards'><div id='playerOneCardsHead'><h2>Your Cards</h2></div><div id='oneCardPictures'><img src='" + playerOneCards[0].image + "'/><img src='" + playerOneCards[1].image + "'/></div><div id='playerOneTotal'><p>" + playerOneCardsSum + "</p></div></div><div id='houseCards'><div id='houseCardsHead'><h2>Dealer's Shown Card</h2></div><div id='housePictures'><img src='" + houseCards[0].image + "'/></div></div><div id='hiddenInfo'><form><input type='hidden' id='deckID' value='" + deckID + "'></input></form></div>";
  if (houseCardsSum == 21) {
    if (playerOneCardsSum == 21) {
      //this is a draw
      document.getElementById("results").innerHTML = "<h1>!!!Draw!!!</h1>";
      var picHtml = "";
      for (let i = 0; i < houseCards.length; ++i) {
          picHtml += "<img src='" + houseCards[i].image + "'/>";
      }
      document.getElementById("housePictures").innerHTML = picHtml;
      document.getElementById("playerOneCardsHead").innerHTML = "<h2>Your Final Cards</h2>";
      document.getElementById("houseCardsHead").innerHTML = "<h2>Dealer's Final Cards</h2>";
    }
    else {
      //the house wins with a natural
      document.getElementById("results").innerHTML = "<h1>!!!Natural House Wins!!!</h1>";
      var picHtml = "";
      for (let i = 0; i < houseCards.length; ++i) {
        picHtml += "<img src='" + houseCards[i].image + "'/>";
      }
      document.getElementById("housePictures").innerHTML = picHtml;
      document.getElementById("playerOneCardsHead").innerHTML = "<h2>Your Final Cards</h2>";
      document.getElementById("houseCardsHead").innerHTML = "<h2>Dealer's Final Cards</h2>";
    }
  }
  else if (playerOneCardsSum == 21) {
    //player wins with natural
    document.getElementById("results").innerHTML = "<h1>!!!You Win With Natural!!!</h1>";
    var picHtml = "";
    for (let i = 0; i < houseCards.length; ++i) {
      picHtml += "<img src='" + houseCards[i].image + "'/>";
    }
    document.getElementById("housePictures").innerHTML = picHtml;
    document.getElementById("playerOneCardsHead").innerHTML = "<h2>Your Final Cards</h2>";
    document.getElementById("houseCardsHead").innerHTML = "<h2>Dealer's Final Cards</h2>";
  }
  else {
    //there are no naturals
    document.getElementById("buttons").innerHTML = "<form><button id='playerDraw' class='pure-button pure-button-primary'>Draw</button><button id='playerHold' class='pure-button pure-button-primary'>Hold</button></form>";
    document.getElementById("playerDraw").addEventListener("click", onDraw);
    document.getElementById("playerHold").addEventListener("click", onHold);
  }
}

function findSum(cards) {
  let sum = 0;
  for (let i = 0; i < cards.length; ++i) {
    if (cards[i].value == "ACE") {
      sum += 11;
    }
    else if (cards[i].value == "KING" || cards[i].value == "QUEEN" || cards[i].value == "JACK") {
      sum += 10;
    }
    else {
      sum += parseInt(cards[i].value);
    }
  }
  return sum;
}

async function drawCard(deckID) {
  let url = "http://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1";
  const response = await fetch(url);
  const json = await response.json();
  return json.cards[0];
}

async function addCardToPlayer(deckID, playerName) {
  const card = await drawCard(deckID);
  let url = "http://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + playerName + "/add/?cards=" + card.code;
  const response = await fetch(url);
  const json = await response.json();
}

async function listPile(deckID, pileName) {
  let url = "http://deckofcardsapi.com/api/deck/" + deckID + "/pile/" + pileName +"/list";
  const response = await fetch(url);
  const json = await response.json();
  return json.piles;
}

document.getElementById("startGame").addEventListener("click", onStart);
