// /* 
// * @Author: BeryJu
// * @Date:   2013-11-06 16:31:08
// * @Email:  jenslanghammer@gmail.com
// * @Last Modified by:   BeryJu
// * @Last Modified time: 2013-11-07 12:47:18
// */
declare module Physijs {

	export var scripts: {
		ammo: string;
		worker: string;
	};

	export class Eventable {

		private _eventListeners: {};

		addEventListener(name: string, callback: () => any): void;
		removeEventListener(name: string, callback: () => any): boolean;
		dispatchEvent(name: string): void;
	}

	export function getObjectId(): number;
	export function getEulerXYZFromQuaternion(x: number, y: number,
		z: number, w: number): THREE.Vector3
	export function getQuatertionFromEuler(x: number, y: number, 
		z: number): {w: number; x: number; y: number; z: number};
	export function convertWorldPositionToObject(position: THREE.Vector3,
		object: THREE.Object3D): THREE.Vector3;

	export function createMaterial(material: THREE.Material, friction: number,
		restitution: number): THREE.Material;

	export class Scene extends THREE.Scene {

		simulate(): void;

	}

	export class PointConstraint {

		constructor(objecta: THREE.Object3D, objectb: THREE.Object3D, 
			position: THREE.Vector3);
		getDefinition(): {
			type: string;
			id: number;
			objecta: THREE.Object3D;
			objectb: THREE.Object3D;
			positiona: THREE.Vector3;
			positionb: THREE.Vector3;
		}

	}

}