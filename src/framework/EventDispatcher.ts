module HG {

	export class EventDispatcher {

		private events: {} = {};

		on(name: any, callback: (args: {}) => any): void {
			if (Array.isArray(name) === true) {
				for (var i = 0; i < name.length; i++) {
					this.on(name[i], callback);
				}
			} else {
				if (typeof name !== "number") {
					name = name.toString().toLowerCase();
				}
				console.log('Added EventHandler for \''+name+'\'');
				if (!this.events[name]) this.events[name] = [];
				this.events[name].push(callback);
			}
		}

		get(name: any): {} {
			if (Array.isArray(name) === true) {
				var events = {};
				for (var i = 0; i < name.length; i++) {
					events[name[i]] = this.get(name[i]);
				}
				return events;
			} else {
				if (typeof name !== "number") {
					name = name.toString().toLowerCase();
				}
				var events = {};
				events[name] = this.events[name];
				return events;
			}
		}

		clear(name: string): void {
			if (typeof name !== "number") {
				name = name.toString().toLowerCase();
			}
			if (!this.events[name]) return;
			if (this.events[name].length === 0) return;
			this.events[name] = [];
		}

		dispatch(name: any, args: {} = {}): void {
			if (Array.isArray(name) === true) {
				for (var i = 0; i < name.length; i++) {
					this.dispatch(name[i], args);
				}
			} else {
				if (typeof name !== "number") {
					name = name.toString().toLowerCase();
				}
				if (!this.events[name]) return;
				if (this.events[name].length === 0) return;
				if (!args['callee']) args['callee'] = name;
				this.events[name].forEach(function(event) {
					event(args);
				});
			}
		}

	}

}