/* 
* @Author: BeryJu
* @Date:   2013-11-06 14:36:09
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-11-29 18:25:46
*/
module HG.Entities {

	export class BaseEntity extends HG.Core.EventDispatcher {

		abilities: HG.Abilities.BaseAbility[] = [];
		object: THREE.Object3D;
		positionOffset: THREE.Vector3 = new THREE.Vector3;

		constructor(object?: THREE.Object3D) {
			super();
			if (object) {
				this.object = object;
			} else {
				this.object = new THREE.Mesh();
			}
		}

		ability(a: HG.Abilities.BaseAbility): boolean {
			var compatible = a.checkCompatibility(this);
			if (compatible === true) {
				a.setHost(this);
				this.abilities.push(a);
			}
			return compatible;
		}

		forAbilities(callback: (a: HG.Abilities.BaseAbility) => void): void {
			this.abilities.forEach(callback);
		}

		offset(x: number, y: number, z: number): BaseEntity {
			this.positionOffset.set(x, y, z);
			return this;
		}

		scale(x: number, y: number, z: number): BaseEntity {
			this.object.scale.set(x, y, z);
			return this;
		}

		position(x: number, y: number, z: number): BaseEntity {
			x = x + this.positionOffset.x;
			y = y + this.positionOffset.y;
			z = z + this.positionOffset.z;
			this.object.position.set(x, y, z);
			return this;
		}

		rotate(x: number, y: number, z: number): BaseEntity {
			this.object.rotation.set(x, y, z);
			return this;
		}

		getInternal(): THREE.Object3D {
			return this.object;
		}

		frame(delta: number): void {
			if (this.abilities.length > 0) {
				this.abilities.forEach((ability) => {
					ability.frame(delta);
				});
			}
		}

	}
}