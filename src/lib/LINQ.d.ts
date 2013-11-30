/*
* @Author: BeryJu
* @Date:   2013-11-30 21:47:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-30 21:58:52
*/
interface Number {
	toRadian(): number;
	toDegrees(): number;
}

interface String {
	f(...args: any[]): string;
	lengthen(length: number, filler?: string): string;
	replaceAll(find: string, replace: string): string;
}

interface Array<T> {
	each(fn: (e: T) => any): void;
	where(query: (e: T) => boolean): T[];
	order(order: (a: T, b: T) => number): T[];
	select(selector: (e: T) => any): T[];
}