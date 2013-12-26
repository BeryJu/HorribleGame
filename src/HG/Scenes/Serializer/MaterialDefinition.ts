/*
* @Author: BeryJu
* @Date:   2013-12-07 22:00:05
* @Email:  jenslanghammer@gmail.com
* @Last Modified by:   BeryJu
* @Last Modified time: 2013-12-26 12:23:13
*/

module HG.Core.Serializer {

	export interface MaterialDefinition {
		type: string;
		properties?: any[];
		color?: number[];
		texture?: string;
	}

}