const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8
};

const SYMBOLS_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2
};

const deposit = () => {
  while(true) {
    const depostiAmount = prompt("Deposite grana para Jogar:  ")
    const numberDepositAmount = parseFloat(depostiAmount);
  
    if(isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log('Nao entendi, tente novamente.');
    } else {
      console.log(`Muito bem voce depositou R$${numberDepositAmount}`);
      return numberDepositAmount;
    }
  }
}

const getNumberOfLines = () => {
  while(true) {
    const lines = prompt("Voce gostaria de apostar em quantas das 3 linhas?:  ")
    const numberOfLines = parseFloat(lines);
  
    if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      if(isNaN(numberOfLines)) console.log('Nao entendi, tente novamente.');
      else if (numberOfLines <= 0 || numberOfLines > 3) console.log('O numero de linhas precisa ser maior que 0 e menor que 4: tente novamente')
    } else {
      console.log(`Entendi, voce acaba de apostar em ${numberOfLines} linhas. Vamos Jogar!!`);
      return numberOfLines;
    }
  }
}

const getBet = (balance, lines) => {
  while(true) {
    const bet = prompt("Quanto do seu deposito vamos apostar em cada linha?:  ")
    const betAmount = parseFloat(bet);
  
    if(isNaN(betAmount) || betAmount <= 0 || betAmount > (balance / lines)) {
      if(isNaN(betAmount)) console.log('Nao entendi, tente novamente.');
      else if (betAmount <= 0) console.log('Ta com medo de perder? aposte um valor maior que Zero!');
      else if (betAmount > (balance / lines)) console.log('Ficou ganancioso? Voce nao tem tanta grana assim! Tente novamente com um valor dentro do seu orcamento!')
    } else {
      console.log(`Entendi, sua aposta e de R$${betAmount} por linha. Boa sore!. Vai precisar!`);
      return betAmount;
    }
  }

};

const spyn = () => {
  const symbols = [];
  for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
    for(let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for(let i = 0; i < COLS; i++){
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbols = reelSymbols[randomIndex];
      reels[i].push(selectedSymbols);
      reelSymbols.slice(randomIndex, 1);
    };
  };
  return reels
};

const transpose = (reels) => {
  //[[a,b,c]. [d,a,c], [d,d,b]]
  //[[a,d,d], [b,a,d], [c,c,b]]
  const rows = [];
  for(let i = 0; i < ROWS; i++) {
    rows.push([]);
    for(let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i])
    }
  }
  return rows;
};

const printRows = (rows) => {
  for(const row of rows) {
    let rowString = "";
    for(const[i, symbol] of row.entries()) {
      rowString +=  symbol;
      if(i != row.length -1) {
        rowString += " | "
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if(allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]]
    }
  }

  return winnings;
};

const game = () => {

  let balance = deposit();

  while (true) {
    console.log(`Voce ainda tem R$${balance} em conta para jogar!`)
    const numberOfLines = getNumberOfLines();
    const betAmount = getBet(balance, numberOfLines);
    balance -= betAmount * numberOfLines;
    const reels = spyn();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, betAmount, numberOfLines);
    balance += winnings;
    console.log(`Parabens! Voce ganhou: R$${winnings.toString()}`);

    if(balance <= 0) {
      console.log(`Espero que essa grana nao seja para pagar o aluguel! Voce perdeu tudo`);

      const playAgain = prompt('Tem mais grana ai para opostar? (S/N): ')
      if (playAgain != 'S' || playAgain != 's') {
        console.log('Ate a proxima perdedor!');
        break;
      }
    }


  }
};

game();
