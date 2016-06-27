///<reference path='core.ts'/>
module Diagram {
	'use strict';

	//				######################################################### Generalisation #########################################################
	export class Generalisation extends Edge {
		constructor() {
			super();
			this.typ = "Generalisation";
		}

		public calc(board) : boolean{
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 50, true);
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$bot.x, this.$bot.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$bot.x, this.$bot.y)));
			return true;
		}

		public drawSourceText(style) {
		};

		public drawTargetText(style) {
		};
	}
	//				######################################################### Implements #########################################################
	export class Implements extends Generalisation {
		constructor() {
			super();
			this.typ = "Implements";
			this.$lineStyle = Line.Format.DOTTED
		}
	}
	//				######################################################### Unidirectional #########################################################
	export class Unidirectional extends Edge {
		constructor() {
			super();
			this.typ = "Unidirectional";
		}
		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 50, false);
			this.$path.push(new Line(new Pos(this.$top.x, this.$top.y), new Pos(this.$endPos.x, this.$endPos.y)));
			this.$path.push(new Line(new Pos(this.$bot.x, this.$bot.y), new Pos(this.$endPos.x, this.$endPos.y)));
			return true;
		};
	}
	//				######################################################### Aggregation #########################################################
	export class Aggregation extends Edge {
		constructor() {
			super();
			this.typ = "Aggregation";
		}

		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 49.8, true);
			this.$path.push(new Path().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter], true, true).withFill("#FFF"));
			return true;
		}
	}
	//				######################################################### Composition #########################################################
	export class Composition extends Edge {
		constructor() {
			super();
			this.typ = "Composition";
		}
		public calc(board) {
			if (!super.calc(board)) {
				return false;
			}
			this.calcMoveLine(16, 49.8, true);
			this.$path.push(new Path().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter],true, true).withFill("#000"));
			return true;
		}
	}
}