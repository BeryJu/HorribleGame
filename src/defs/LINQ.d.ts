/*
* @Author: BeryJu
* @Date:   2013-11-30 21:47:15
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-30 20:23:39
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
	contains(contains: string): boolean;
}

interface Array<T> {
	where(query: (e: any) => boolean): any[];
	order(order: (a: any, b: any) => number): any[];
	select(selector: (e: any) => any): any[];
}