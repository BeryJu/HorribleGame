/*
* StringFormatter.ts
* Author: BeryJu
*/

module HG {
	
	export class StringFormatter {

		static format(s: string, values: {}): string {
			var replaceAll = (find, replace, str) => {
				return str.replace(new RegExp(find, 'g'), replace);
			};
			for (var k in values) {
				replaceAll(k, values[k], s);
			}
			return s;
		}

	}

}