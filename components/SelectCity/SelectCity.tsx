import { SelectCityProps } from './SelectCity.props';
import { CitiesInterface } from '../../typesAndInterfaces/interfaces';
import React, { useState, useEffect } from 'react';
import { Select, Button } from '../../components';
import { useRouter } from "next/router";
import { Constants, ML } from '../../globals';

export const SelectCity = ({ listCities, text }: SelectCityProps): JSX.Element => {
	const translateCountries = () => {
		listCities.map(city => {
			if (text[city.route]) city.translation = text[city.route];
		});
	}
	translateCountries();

	const [list, setList] = useState<CitiesInterface.Db[]>(listCities || []);
	const [pathCity, setPathCity] = useState<string | null>(null);
	const router = useRouter();

	const handleClick = () => {
		if (pathCity) {
			router.push({
				pathname: Constants.paths.pathAllWithCities,
				query: {countries: router.query.countries, cities: pathCity}
			});
		}
	};

	const handleSelect = (value: string) => setPathCity(value);
	
	useEffect(() => {
		setList(listCities);
	}, [listCities]);

	
	return (
		<div>
			<Select
				nameEmptyOption={text[ML.key.selectCity]}
				nameKeyOption='id'
				nameValueOption='route'
				nameInnerOption='translation'
				list={list}
				valueSelect={(value: string) => handleSelect(value)}
				rightAngle={true}
			/>
			<Button
				name={text[ML.key.goTo]}
				onClick={handleClick}
				leftAngle={true}
			/>
		</div>
	);
};