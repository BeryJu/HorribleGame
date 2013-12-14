/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-14 00:30:41
*/

module HG.Scenes.Serializer {

	export interface RawShaderDefinition {
		vertex: string;
		fragment: string;
		meta: {
			type: string;
			properties: {}
		};
	}

}