import {SelectCountryProps} from './SelectCountry.props';
import {CountriesInterface, LanguagesInterface} from '../../typesAndInterfaces/interfaces';
import React, {useState} from 'react';
import {useRouter} from "next/router";
import {Constants, Helpers, ML} from '../../globals';
import {SelectWithImage} from '../../components';
import styles from './SelectCountry.module.css';

export const SelectCountry = ({listCountries, listLanguages, text}: SelectCountryProps): JSX.Element => {
	const translateCountries = () => {
		listCountries.map(country => {
			if (text[country.route]) country.translation = text[country.route];
		});
	}
	translateCountries();

	const router = useRouter();
	const [countries] = useState<CountriesInterface.Db[]>(listCountries || []);
	const [languages] = useState<LanguagesInterface.Db[]>(listLanguages || []);
	const [pathCountry, setPathCountry] = useState<string | null>(null);

	const handleClick = () => {
		const urlCountry = pathCountry && Helpers.getUrlCountry(pathCountry, countries, languages);
		if (urlCountry) {
			router.push({
				pathname: Constants.namePages.countries,
				query: {countries: urlCountry}
			});
		}
	};

	const handleSelectCountry = (value: string) => {
		setPathCountry(ML.getPathByCountry(countries, languages, value));
	};
	
	return (
		<div className={styles.selectCountry}>
			<SelectWithImage
				nameEmptyOption={text[ML.key.selectCountry]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='translation'
				settingPathsImages='selectwithimage/countries'
				extensionFilesImages='png'
				list={countries}
				valueSelect={(value:string) => handleSelectCountry(value)}
				button={true}
				nameButton={text[ML.key.goTo] as string}
				clickButton={handleClick}
			/>
		</div>
	);
};