import {TypeObjectsFromDb} from '../types';

export interface Get<ObjectFromDB extends TypeObjectsFromDb> {
	code: 200 | 404;
	data: ObjectFromDB[] | undefined;
}

export interface Add {
	code: 200 | 404;
	data: {id: string} | undefined;
}

export interface Update {
	code: 200 | 404;
	data: null | undefined;
}

export interface Remove {
	code: 200;
	data: null;
}