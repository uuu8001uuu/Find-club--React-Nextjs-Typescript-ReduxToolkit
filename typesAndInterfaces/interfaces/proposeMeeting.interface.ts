import {CitiesInterface, InterestsInterface, CategoryInterface} from '../interfaces';

export interface DataMeeting {
	idUser: string;
	idCountry: number;
	idCity: number;
	idInterest: number;
	idCategory: number;
	idLanguage: number;
	dateMeeting: string;
	placeMeeting: string;
	typeMeeting: number;
	accessMeeting: number;
	dateCreation: string;
	status: number;
}

export interface DataForm {
	selectCountry: string;
	selectCity: string;
	selectInterest: string;
	selectCategory: string;
	selectLanguage: string;
	selectDateMeeting: string;
	selectPlaceMeeting: string;
}

export interface DataSelects {
	listCities: CitiesInterface.WithTranslation[];
	listInterests: InterestsInterface.WithTranslation[];
	listCategories: CategoryInterface.WithTranslation[];
}