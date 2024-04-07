import { Card, CardAction, CardColor, newDeck, shuffleDeck } from "./Cards";

interface Player {
	id: number;
	name: string;
	hand: Card[];
}

export class Game {
	players: Player[] = [];
	currentPlayer: number = 0;
	tableDeck: Card[] = [];
	drawDeck: Card[] = [];
	direction: 1 | -1 = 1;
	sumToDraw: number = 0;
	hasSkipped: boolean = true;
	currentWildColor: CardColor = CardColor.Black;



	addPlayer(name: string) {
		this.players.push({ id: this.players.length, name, hand: [] });
	}

	start() {
		this.drawDeck = newDeck();
		this.tableDeck = [this.drawDeck.pop()!];
		for (let player of this.players) {
			player.hand = this.drawDeck.splice(0, 7);
		}
	}

	canPlayCard(card : Card): boolean {
		const topCard = this.tableDeck[this.tableDeck.length - 1];

		// Si te han saltado el turno, no puedes jugar
		if (topCard.action === CardAction.Skip && !this.hasSkipped) return false;

		// Comodín de color en cualquier momento que no tengas que robar
		if (this.sumToDraw === 0 && card.action === CardAction.Wild) return true;

		// Comodín +4 se puede jugar en cualquier momento
		if (card.action === CardAction.Draw4) return true;

		// Si la carta es del color que se eligió en el comodín de la mesa, se puede jugar
		if (topCard.color === CardColor.Black && this.sumToDraw === 0 && card.color === this.currentWildColor) return true;

		// Si la carta es un +2 del color que se eligió en el +4 de la mesa se puede jugar
		if (topCard.color === CardColor.Black && topCard.action === CardAction.Draw4 && card.action === CardAction.Draw2 && card.color === this.currentWildColor) return true;

		// Si te toca robar, solo puedes jugar cartas de robar
		if (this.sumToDraw > 0 && card.action === CardAction.Draw2 && topCard.action === CardAction.Draw2) return true;

		// Si la carta es del mismo color que la de arriba, se puede jugar
		if (this.sumToDraw !== 0 && card.color === topCard.color) return true;

		// Si la carta tiene el mismo número que la de arriba, se puede jugar
		if (this.sumToDraw !== 0 && card.digit === topCard.digit) return true;

		// Si la carta tiene la misma acción que la de arriba, se puede jugar
		if (this.sumToDraw !== 0 && card.action === topCard.action) return true;

		return false;
	}

	playCard(playerId: number, card : Card) {
		if (!this.hasSkipped) return false;
		const player = this.players[playerId];
		const cardIndex = player.hand.findIndex(c => c.id === card.id);
		if (cardIndex === -1) return false;
		if (!this.canPlayCard(card)) return false;
		player.hand.splice(cardIndex, 1);
		this.tableDeck.push(card);
		if (card.action === CardAction.Reverse) {
			this.direction *= -1;
		}
		if (card.action === CardAction.Skip) {
			this.hasSkipped = false;
		}
		if (card.action === CardAction.Draw2) {
			this.sumToDraw += 2;
		}
		if (card.action === CardAction.Draw4) {
			this.sumToDraw += 4;
		}
		if (card.action === CardAction.Wild) {
			this.currentWildColor = this.chooseColor();
		}
		if (card.action === CardAction.Draw4) {
			this.sumToDraw += 4;
			this.currentWildColor = this.chooseColor();
		}

	}


	chooseColor(): CardColor {
		// TODO: Implementar lógica para elegir color
		return CardColor.Red;
	}
}