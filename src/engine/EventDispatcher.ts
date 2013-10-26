/*
* EventDispatcher.ts
* Author: BeryJu
*/

module HG {

	export class EventDispatcher {

		private events: {} = {};
		eventsAvailable: string[] = [];

		on(name: string[], callback: (args: {}) => void): void;
		on(name: string, callback: (args: {}) => void): void;
		on(name: number[], callback: (args: {}) => void): void;
		on(name: number, callback: (args: {}) => void): void;
		on(name: any, callback: (args: {}) => void): void {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.on(n, callback);
				});
			} else {
				if (typeof name !== "number") name = name.toString().toLowerCase();
				var type = this['constructor']['name'];
				if (this.eventsAvailable.indexOf(name) === -1) {
					console.warn("["+type+"] Event '"+name+"' not available, still added though");
				} else {
					console.log("["+type+"] Added EventHandler for '"+name+"'");
				}
				if (!this.events[name]) this.events[name] = [];
				this.events[name].push(callback);
			}
		}

		get(name: string[]): {};
		get(name: string): {};
		get(name: number[]): {};
		get(name: number): {};
		get(name: any): {} {
			if (Array.isArray(name) === true) {
				var events = {};
				name.forEach((n) => {
					events[n] = this.get(n);
				});
				return events;
			} else {
				if (typeof name !== "number") name = name.toString().toLowerCase();
				var events = {};
				events[name] = this.events[name];
				return events;
			}
		}

		clear(name: string): void {
			if (typeof name !== "number") name = name.toString().toLowerCase();
			if (!this.events[name]) return;
			if (this.events[name].length === 0) return;
			this.events[name] = [];
		}

		dispatch(name: string[], args?: {}): void;
		dispatch(name: string, args?: {}): void;
		dispatch(name: number[], args?: {}): void;
		dispatch(name: number, args?: {}): void;
		dispatch(name: any, args?: {}): void {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.dispatch(n, args);
				});
			} else {
				if (typeof name !== "number") name = name.toString().toLowerCase();
				if (!(name in this.eventsAvailable)) this.eventsAvailable.push(name);
				if (!this.events[name]) return;
				if (this.events[name].length === 0) return;
				if (!args) args = {}
				if (!args['callee']) args['callee'] = name;
				this.events[name].forEach((event) => {
					event(args);
				});
			}
		}

	}

}