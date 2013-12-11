/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-07 23:36:56
*/

module HG.Scenes.Serializer {

	export interface MaterialDefinition {
		type: string;
		properties?: any[];
		color?: number[];
		texture?: string;
	}

}