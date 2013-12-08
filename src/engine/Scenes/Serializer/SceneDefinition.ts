/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 22:24:47
*/

module HG.Scenes.Serializer {

	export interface SceneDefinition {
		camera: HG.Scenes.Serializer.EntityDefinition;
		color?: number[];
		colorAlpha: number;
		entities: HG.Scenes.Serializer.EntityDefinition[];
	}

}