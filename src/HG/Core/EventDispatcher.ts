/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:08
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-18 21:51:44
*/

module HG.Core {

	export class EventDispatcher {

		// holds all event eventHandlers like
		private _events: {} = {};
		// same for public events
		private _globalEvents: any[] = [];
		// holds events available to subscribe to
		events: string[] = [];

		constructor(events?: string[]) {
			this.events = events || [];
		}

		private resolve(raw: any): string {
			if (HG.Utils.isNumber(raw) === true) {
				return raw.toString();
			} else {
				return raw.toString().toLowerCase();
			}
		}

		merge(otherDispatcher: HG.Core.EventDispatcher): HG.Core.EventDispatcher {
			var newDispatcher = new HG.Core.EventDispatcher();
			newDispatcher.events = this.events.concat(otherDispatcher.events);
			for (var k in this._events) {
				newDispatcher._events[k] = this._events[k];
			}
			for (var k in otherDispatcher._events) {
				newDispatcher._events[k] = otherDispatcher._events[k];
			}
			newDispatcher._globalEvents = this._globalEvents.concat(otherDispatcher._globalEvents);
			return newDispatcher;
		}

		every(eventHandler: (...args: any[]) => any): HG.Core.EventDispatcher {
			this._globalEvents.push(eventHandler);
			return this;
		}

		on(name: any, eventHandler?: Function): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => this.on(n, eventHandler));
			} else {
				var type = this["constructor"]["name"];
				var resolved = this.resolve(name);
				// if not in .events, warn; else just log
				if (this.events.indexOf(resolved) === -1) {
					HG.locale.event.eventNotAvailable.format(type, name).warn();
				} else {
					HG.locale.event.eventAdded.format(type, name).log();
				}
				// if no events list for name, create one
				if (!this._events[resolved]) {
					this._events[resolved] = [];
				}
				// if no eventHandler, check if function is on this class
				if (!eventHandler) {
					if (this[resolved] && HG.Utils.isFunction(this[resolved])) {
						// use this
						eventHandler = this[resolved];
					} else {
						HG.locale.event.isEmpty.error();
					}
				}
				// actually add the eventHandler
				this._events[resolved].push(eventHandler);
				return this;
			}
		}

		bind = this.on;
		addEventListener = this.on;

		clear(name: string): HG.Core.EventDispatcher {
			if (typeof name !== "number") name = name.toString().toLowerCase();
			if (!this._events[name]) return;
			if (this._events[name].length === 0) return;
			this._events[name] = [];
			return this;
		}

		dispatch(name: any, ...args: any[]): HG.Core.EventDispatcher {
			if (Array.isArray(name) === true) {
				name.forEach((n) => this.dispatch(n, args));
			} else {
				var resolved = this.resolve(name);
				if (!(resolved in this.events)) this.events.push(resolved);
				if (!this._events[resolved]) return;
				if (this._events[resolved].length === 0) return;
				var parameters = Array.prototype.splice.call(arguments, 1);
				parameters.push(resolved);
				this._events[resolved].forEach((event) => {
					event.apply(this, parameters);
				});
				this._globalEvents.forEach((event) => {
					event.apply(this, parameters);
				});
				return this;
			}
		}

		emit = this.dispatch;

	}

}