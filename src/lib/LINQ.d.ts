/*
* @Author: BeryJu
* @Date:   2013-11-30 21:47:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-02 18:37:02
*/
interface Number {
	toRadian(): number;
	toDegrees(): number;
}

interface String {
	f(...args: any[]): string;
	format(...args: any[]): string;
	log(): void;
	warn(): void;
	lengthen(length: number, filler?: string): string;
	replaceAll(find: string, replace: string): string;
}

interface Array<T> {
	each(fn: (e: T, i: any) => void): void;
	where(query: (e: T) => boolean): T[];
	order(order: (a: T, b: T) => number): T[];
	select(selector: (e: T) => any): T[];
}

interface Object {
	each(fn: (k: string, v: any) => any): void;
}