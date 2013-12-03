/*
* @Author: BeryJu
* @Date:   2013-11-30 21:47:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-03 20:59:30
*/
interface Number {
	toRadian(): number;
	toDegrees(): number;
}

interface String {
	f(...args: any[]): string;
	format(arg1: any, ...args: any[]): string;
	log(): void;
	warn(): void;
	error(): void;
	lengthen(length: number, filler?: string): string;
	replaceAll(find: string, replace: string): string;
}

interface Array<T> {
	where(query: (e: T) => boolean): T[];
	order(order: (a: T, b: T) => number): T[];
	select(selector: (e: T) => any): T[];
}

interface Object {
	forEach(fn: (k: string, v: any) => any): void;
}