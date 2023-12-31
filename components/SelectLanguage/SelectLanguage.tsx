import {SelectLanguageProps} from './SelectLanguage.props';
import React, { useState, useEffect } from 'react';
import { SelectWithImage } from '../../components';
import { LanguagesInterface } from '../../typesAndInterfaces/interfaces';
import { ML } from '../../globals';
import { useRouter } from 'next/router';
import { TypeLanguages } from '../../typesAndInterfaces/types';

export const SelectLanguage = ({ listLanguages, updateLanguage, text, country }: SelectLanguageProps): JSX.Element => {
	const router = useRouter();
	const [list, setList] = useState<LanguagesInterface.Db[]>([]);

	const statedLanguage = ML.getLanguage();
	
	const [selectedOption, setSelectedOption] = useState(statedLanguage);

	const handleSelect = (value: TypeLanguages) => {
		if (value) {
			ML.setLanguage(value);
			setSelectedOption(value);

			if (router.pathname !== '/' && Object.keys(router.query).length && !router?.query?.callbackUrl) {
				let urlCountry = (router.query.countries as string).slice(0, 2);
				if (urlCountry) {
					const settingLanguage = ML.getLanguage();
					const currentCountry = country;
					const currentLanguage = list.find(language => currentCountry && language.idCountry === currentCountry.id);
					if (!settingLanguage && currentLanguage) {
						ML.setLanguage(currentLanguage.route);
					}
					
					urlCountry = urlCountry + ML.addInPathLanguage(settingLanguage, currentLanguage, urlCountry);
					
					const queryPaths: QueryPaths = {
						countries: urlCountry
					}
					if (router.query.cities?.length) queryPaths.cities = router.query.cities as string;
					if (router.query.interests?.length) queryPaths.interests = router.query.interests as string;
					if (router.query.categories?.length) queryPaths.categories = router.query.categories as string;
					
					router.push({
						pathname: router.pathname,
						query: queryPaths
					}).then(() => router.reload());
				}
			} else {
				updateLanguage();
			}
		}
	}

	useEffect(() => {
		setSelectedOption(statedLanguage);
	}, [statedLanguage]);

	useEffect(() => {
		setList(listLanguages);
	}, [listLanguages]);

	return (
		<div>
			{list?.length && selectedOption && <SelectWithImage
				nameEmptyOption={text[ML.key.selectLanguage]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='name'
				nameSelectedOption={selectedOption}
				settingPathsImages='selectwithimage/languages'
				extensionFilesImages='png'
				list={list}
				valueSelect={(value:string) => handleSelect(value as TypeLanguages)}
			/>}
		</div>
	);
};

interface QueryPaths {
	countries: string;
	[key:string]: string;
}