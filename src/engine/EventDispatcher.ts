/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-18 21:00:43
*/

module HG {

	export class EventDispatcher {

		//holds all event callbacks like
		//{ name: [cb1, cb2 ] }
		private events: {} = {};
		private globalEvents: any[] = [];
		//holds events available to subscribe to
		//if subscribed to an event not in there,
		//there will be a warning
		eventsAvailable: string[] = [];

		resolve(raw: any): string {
			var result: string;
			if (typeof raw === "number") {
				result = raw.toString();
			} else {
				result = raw.toString().toLowerCase();
			}
			return result;
		}

		onAll(callback: (...args: any[]) => any): any {
			this.globalEvents.push(callback);
		}

		on(name: string[], callback?: (...args: any[]) => any): any;
		on(name: string, callback?: (...args: any[]) => any): any;
		on(name: number[], callback?: (...args: any[]) => any): any;
		on(name: number, callback?: (...args: any[]) => any): any;
		on(name: any, callback?: (...args: any[]) => any): any {
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
				return this;
			}
		}

		inject(name: any, callback: (...args: any[]) => any): any {
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
				return this;
			}
		}

		clear(name: string): any {
			if (typeof name !== "number") name = name.toString().toLowerCase();
			if (!this.events[name]) return;
			if (this.events[name].length === 0) return;
			this.events[name] = [];
			return this;
		}

		dispatch(name: string[], ...args: any[]): any;
		dispatch(name: string, ...args: any[]): any;
		dispatch(name: number[], ...args: any[]): any;
		dispatch(name: number, ...args: any[]): any;
		dispatch(name: any, ...args: any[]): any {
			if (Array.isArray(name) === true) {
				name.forEach((n) => this.dispatch(n, args));
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
				this.globalEvents.forEach((event) => {
					event.apply(this, parameters);
				});
				return this;
			}
		}

	}

}