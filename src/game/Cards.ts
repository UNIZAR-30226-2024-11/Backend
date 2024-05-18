export enum CardColor {
  Blue = "blue",
  Green = "green",
  Red = "red",
  Yellow = "yellow",
  Black = "black",
}

export enum CardAction {
  Skip = "skip",
  Reverse = "reverse",
  Draw2 = "draw2",
  Draw4 = "draw4",
  Wild = "wild",
}

export interface Card {
  id?: number;
  digit?: number;
  color?: CardColor;
  action?: CardAction;
}

export function newDeck(): Card[] {
  const deck: Card[] = [];
  for (let i = 0; i < 10; i++) {
    for (const color of [
      CardColor.Blue,
      CardColor.Green,
      CardColor.Red,
      CardColor.Yellow,
    ]) {
      deck.push({ id: deck.length, digit: i, color });
      if (i !== 0) {
        // Solo hay un 0 de cada color
        deck.push({ id: deck.length, digit: i, color });
      }
    }
  }
  for (const color of [
    CardColor.Blue,
    CardColor.Green,
    CardColor.Red,
    CardColor.Yellow,
  ]) {
    for (const action of [
      CardAction.Skip,
      CardAction.Reverse,
      CardAction.Draw2,
    ]) {
      deck.push({ id: deck.length, action, color });
      deck.push({ id: deck.length, action, color });
    }
  }
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: deck.length,
      action: CardAction.Wild,
      color: CardColor.Black,
    });
    deck.push({
      id: deck.length,
      action: CardAction.Draw4,
      color: CardColor.Black,
    });
  }
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
