module HG {

	export class rgb {
		r: number;
		g: number;
		b: number;
		constructor(r: number = 0, g: number = 0, b: number = 0) {
			this.r = r;
			this.g = g;
			this.b = b;
		}
	}

	export class rgba extends rgb{
		a: number;
		constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 0) {
			super(r, g, b);
			this.a = a;
		}
	}

}