/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 23:36:13
*/

module HG.Scenes.Serializer {

	export interface EntityDefinition {
		type: string;
		properties: any[];
		abilities?: HG.Scenes.Serializer.AbilityDefinition[];
		object: HG.Scenes.Serializer.ObjectDefinition;
		material?: HG.Scenes.Serializer.MaterialDefinition;
		geometry?: HG.Scenes.Serializer.ObjectDefinition;
		name?: string;
		// for loading a model
		model?: string;
		// positioning
		scale?: number[];
		position?: number[];
		offset?: number[];
		rotation?: number[];

	}

}