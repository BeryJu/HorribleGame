/*
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 14:38:59
*/
module HG.Entities {

	export class Entity extends HG.Core.EventDispatcher implements HG.Resource.ILoadable {

		abilities: HG.Abilities.Ability[] = [];
		object: THREE.Object3D;
		name: string;
		positionOffset: THREE.Vector3 = new THREE.Vector3();
		velocity: THREE.Vector3 = new THREE.Vector3();

		constructor(object?: THREE.Object3D) {
			super();
			if (object) {
				this.object = object;
			} else {
				this.object = new THREE.Mesh();
			}
		}

		ability(a: HG.Abilities.Ability): boolean {
			var compatible = a.checkCompatibility(this);
			if (compatible === true) {
				a.setHost(this);
				this.abilities.push(a);
			}
			return compatible;
		}

		forAbilities(callback: (a: HG.Abilities.Ability) => void): void {
			this.abilities.forEach(callback);
		}

		offset(x: number, y: number, z: number): Entity {
			this.positionOffset.set(x, y, z);
			return this;
		}

		load(data: any): void { return; }

		scale(x: number, y?: number, z?: number): Entity {
			if (!y && !z) y = x; z = x;
			this.object.scale.set(x, y, z);
			return this;
		}

		position(x: number, y?: number, z?: number): Entity {
			if (!y && !z) y = x; z = x;
			x = x + this.positionOffset.x;
			y = y + this.positionOffset.y;
			z = z + this.positionOffset.z;
			this.object.position.set(x, y, z);
			return this;
		}

		rotate(x: number, y: number, z: number): Entity {
			this.object.rotation.set(x, y, z);
			return this;
		}

		getInternal(): THREE.Object3D {
			return this.object;
		}

		frame(delta: number): void {
			// this.velocity.x += ( - this.velocity.x ) * 0.08 * delta;
			// this.velocity.z += ( - this.velocity.z ) * 0.08 * delta;
			// this.velocity.y -= 0.25 * delta;

			// console.log(("{x}, {y}, {z}".f({
			// 	x: this.object.position.x,
			// 	y: this.object.position.y,
			// 	z: this.object.position.z
			// })));
			// this.object.position.x = this.positionOffset.x + this.velocity.x;
			// this.object.position.y = this.positionOffset.x + this.velocity.y;
			// this.object.position.z = this.positionOffset.x + this.velocity.z;

			if (this.abilities.length > 0) {
				this.abilities.forEach((ability) => {
					ability.frame(delta);
				});
			}
		}

	}
}