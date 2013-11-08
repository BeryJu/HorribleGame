/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-08 21:46:51
*/

module HG {

	export class EventDispatcher {

		//holds all event callbacks like
		//{ name: [cb1, cb2 ] }
		private events: {} = {};
		//holds events available to subscribe to
		//if subscribed to an event not in there,
		//there will be a warning
		eventsAvailable: string[] = [];

		on(name: string[], callback?: (...args) => any): void;
		on(name: string, callback?: (...args) => any): void;
		on(name: number[], callback?: (...args) => any): void;
		on(name: number, callback?: (...args) => any): void;
		on(name: any, callback?: (...args) => any): void {
			//if name is array, iterate over all of them
			//and add them all
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.on(n, callback);
				});
			} else {
				var type = this['constructor']['name'];

				//if not number, lowercase and stringify
				if (typeof name !== "number") {
					name = name.toString().toLowerCase();
				}
				//if not in .eventsAvailable, warn; else just log
				if (this.eventsAvailable.indexOf(name) === -1) {
					console.warn("["+type+"] Event '"+name+"' not available, still added though");
				} else {
					console.log("["+type+"] Added EventHandler for '"+name+"'");
				}
				//if no events list for name, create one
				if (!this.events[name]) {
					this.events[name] = [];
				}
				//if no callback, check if function is on this class
				//use this
				if (!callback) {
					if (this[name] && typeof(this[name]) === 'function') {
						callback = this[name];
					}
				}
				//actually add the callback
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

		dispatch(name: string[], ...args): void;
		dispatch(name: string, ...args): void;
		dispatch(name: number[], ...args): void;
		dispatch(name: number, ...args): void;
		dispatch(name: any, ...args): void {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.dispatch(n, args);
				});
			} else {
				if (typeof name !== "number") name = name.toString().toLowerCase();
				if (!(name in this.eventsAvailable)) this.eventsAvailable.push(name);
				if (!this.events[name]) return;
				if (this.events[name].length === 0) return;
				var parameters = Array.prototype.splice.call(arguments, 1);
				parameters.push(name);
				this.events[name].forEach((event) => {
					event.apply(this, parameters);
				});
			}
		}

	}

}