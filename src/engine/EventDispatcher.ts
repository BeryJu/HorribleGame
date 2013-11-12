/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-12 13:00:41
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

		resolve(raw: any): string {
			var result = "";
			if (typeof raw === "number") {
				result = raw.toString();
			} else {
				result = raw.toString().toLowerCase();
			}
			return result;
		}

		on(name: string[], callback?: (...args) => any): void;
		on(name: string, callback?: (...args) => any): void;
		on(name: number[], callback?: (...args) => any): void;
		on(name: number, callback?: (...args) => any): void;
		on(name: any, callback?: (...args) => any): void {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.on(n, callback);
				});
			} else {
				var type = this['constructor']['name'];
				var resolved = this.resolve(name);
				//if not in .eventsAvailable, warn; else just log
				if (this.eventsAvailable.indexOf(resolved) === -1) {
					console.warn("["+type+"] Event '"+name+"' not available, still added though");
				} else {
					console.log("["+type+"] Added EventHandler for '"+name+"'");
				}
				//if no events list for name, create one
				if (!this.events[resolved]) {
					this.events[resolved] = [];
				}
				//if no callback, check if function is on this class
				//use this
				if (!callback) {
					if (this[resolved] && typeof(this[resolved]) === 'function') {
						callback = this[resolved];
					} else {
						throw new Error("Can't add empty event Handler");
					}
				}
				//actually add the callback
				this.events[resolved].push(callback);
			}
		}

		inject(name: any, callback: (...args) => any): void {
			if (Array.isArray(name) === true) {
				name.forEach((n) => {
					this.inject(n, callback);
				});
			} else {
				var type = this['constructor']['name'];
				var resolved = this.resolve(name);
				//if no events list for name, create one
				if (!this.events[resolved]) {
					this.events[resolved] = [];
				}
				console.log("["+type+"] Injected EventHandler for '"+name+"'");
				//actually add the callback
				this.events[resolved].splice(0, 0, callback);
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
				var resolved = this.resolve(name);
				if (!(resolved in this.eventsAvailable)) this.eventsAvailable.push(resolved);
				if (!this.events[resolved]) return;
				if (this.events[resolved].length === 0) return;
				var parameters = Array.prototype.splice.call(arguments, 1);
				parameters.push(resolved);
				this.events[resolved].forEach((event) => {
					event.apply(this, parameters);
				});
			}
		}

	}

}