import { Card, CardAction, CardColor, newDeck, shuffleDeck } from "./Cards";
import { db } from "../config";
import { QueryResult } from 'pg';

const CREATE_GAME = `
  INSERT INTO game (player1, player2, player3, player4, current_player, direction, sumToDraw, hasSkipped, currentWildColor, tableDECK, drawDeck)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  ` 

const FIND_BY_USERNAME_OR_EMAIL_QUERY = `
  SELECT DISTINCT *
  FROM users
  WHERE username = $1 OR email = $2
  `

interface Player {
	id: number;
	name: string;
	hand: Card[];
}

export class Game {
	gameId: number | null = null;
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
		// Crear una nueva partida en la tabla "game"
		db.query(CREATE_GAME, [
			this.players[0].id, // player1
			this.players[1].id, // player2
			this.players[2].id, // player3
			this.players[3].id, // player4
			this.currentPlayer,
			this.direction,
			this.sumToDraw,
			this.hasSkipped ? 1 : 0,
			this.currentWildColor,
			JSON.stringify(this.tableDeck),
			JSON.stringify(this.drawDeck)
		]).then((result: QueryResult<any>) => {
			// Obtener el ID de la partida generada
			this.gameId = result.rows[0].id;
			console.log("Nueva partida creada:", gameId);
			// Insertar las cartas de cada jugador en la tabla "player_card"
			for (let player of this.players) {
				player.hand = this.drawDeck.splice(0, 7);
				db.query(`
					INSERT INTO player_card (game, player, hand)
					VALUES ($1, $2, $3)`, [this.gameId, player.id, JSON.stringify(player.hand)]);
			}
		}).catch((error: any) => {
			console.error("Error al iniciar la partida:", error);
		});

		/*
		this.drawDeck = newDeck();
		this.tableDeck = [this.drawDeck.pop()!];
		for (let player of this.players) {
			player.hand = this.drawDeck.splice(0, 7);
		}*/
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

	canPlay(playerId: number): boolean {
		const player = this.players[playerId];
		return player.hand.some(card => this.canPlayCard(card));
	}

	playCard(playerId: number, card : Card) {
		if (!this.hasSkipped){
			this.hasSkipped = true;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		if (this.sumToDraw > 0){
			for (let i = 0; i < this.sumToDraw; i++){
				this.players[this.currentPlayer].hand.push(this.drawDeck.pop()!);
			}
			this.sumToDraw = 0;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		const player = this.players[playerId];
		const cardIndex = player.hand.findIndex(c => c.id === card.id);
		if (cardIndex === -1) return false;
		if (!this.canPlayCard(card)) return false;
		player.hand.splice(cardIndex, 1);
		this.tableDeck.push(card);
		if (card.action === CardAction.Reverse) {
			this.direction *= -1;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		if (card.action === CardAction.Skip) {
			this.hasSkipped = false;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		if (card.action === CardAction.Draw2) {
			this.sumToDraw += 2;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		if (card.action === CardAction.Draw4) {
			this.sumToDraw += 4;
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		if (card.action === CardAction.Wild) {
			this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
			return;
		}
		// Actualiza la base de datos que registra las cartas del jugador
		db.query(`
			UPDATE player_card
			SET hand = $1
			WHERE game_id = $2 AND player_id = $3
		`, [player.hand, this.gameId, playerId])
		.then(() => {
			console.log("Carta jugada y actualizada en la base de datos.");
			// Añade la carta al drawDeck de la partida
			this.drawDeck.push(card);
		})
		.catch((error: any) => {
			console.error("Error al actualizar la carta jugada en la base de datos:", error);
		});

		this.currentPlayer = (this.currentPlayer + this.direction) % this.players.length;
		return;

	}

	cantPlay(playerId: number) {
		const player = this.players[playerId];
		var card = this.drawDeck.pop() as Card;
		while (!this.canPlayCard(card)){
			player.hand.push(card);
			card = this.drawDeck.pop() as Card;
		}
		this.playCard(playerId, card);
	}


	chooseColor(CardColor: CardColor) {
		// TODO: Implementar lógica para elegir color
		this.currentWildColor = CardColor;
	}

	getState() {
		return {
			players: this.players,
			currentPlayer: this.currentPlayer,
			tableDeck: this.tableDeck,
			drawDeck: this.drawDeck.length,
			direction: this.direction,
			sumToDraw: this.sumToDraw,
			hasSkipped: this.hasSkipped,
			currentWildColor: this.currentWildColor,
		};
	}
}