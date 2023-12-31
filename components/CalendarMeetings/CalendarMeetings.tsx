import React, { useEffect } from 'react';
import { CalendarMeetingsProps } from './CalendarMeetings.props';
import Calendar from 'react-calendar'
import { CalendarMeetingsSlice, SelectFilterSlice } from '../../store/slices';
import { Constants, Helpers } from '../../globals';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { useRouter } from 'next/router';
import { CalendarInterface } from '../../typesAndInterfaces/interfaces';

const highlight = 'highlight';

export const CalendarMeetings = ({language, metadataLanguage, ...props}: CalendarMeetingsProps):JSX.Element => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const selectedDayCalendar = useAppSelector(state => CalendarMeetingsSlice.selectedDaySelect(state));
	const selectedDay = selectedDayCalendar ? Helpers.convertFromReduxToDatetimeLocal(selectedDayCalendar) : undefined;
	const calendarMeetings = useAppSelector(state => CalendarMeetingsSlice.calendarMeetingsSelect(state));
	const activeStartDateChange = useAppSelector(state => CalendarMeetingsSlice.activeStartDateChangeSelect(state));
	const selectFilter = useAppSelector(state => SelectFilterSlice.selectFilter(state));

	const maxDate = Helpers.convertFromReduxToDatetimeLocal(calendarMeetings.maxDate);

	const changeSelectedDay = (e?: Date | undefined) => {
		if (!e && activeStartDateChange) {
			const activeStartDate = activeStartDateChange?.activeStartDate ? Helpers.convertFromReduxToDatetimeLocalAndShiftTimezone(activeStartDateChange?.activeStartDate) : undefined;
			e = activeStartDate;
		}
		dispatch(CalendarMeetingsSlice.setSelectedDay(e || null));
		if (selectFilter.basic === Constants.nameBasicFilter.month) dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.day));
	}

	const changeActiveStartDateChange = (e: CalendarInterface.EventActiveStartDateChange) => {
		dispatch(CalendarMeetingsSlice.setActiveStartDateChange(e));
		dispatch(CalendarMeetingsSlice.setSelectedDay(null));
		dispatch(SelectFilterSlice.setBasicFilterFilter(Constants.nameBasicFilter.month));
	}

	useEffect(() => {
		if (selectFilter.basic === Constants.nameBasicFilter.month) {
			dispatch(CalendarMeetingsSlice.setSelectedDay(null));
		}
		if (selectFilter.basic === Constants.nameBasicFilter.day) {
			changeSelectedDay();
		}
	}, [selectFilter])

	useEffect(() => {
		const request = dispatch(CalendarMeetingsSlice.setListDatemeetingsPerMonthAsync({router: router.query, language}));
		return () => request.abort()
	}, [activeStartDateChange])

	return (
		<>
			<Calendar
				// @ts-ignore // turned off type checking types because i use custom function conflicting react-calendar types for onChange
				onChange={changeSelectedDay} value={selectedDay}
				minDate={new Date()} maxDate={maxDate ? new Date(maxDate) : undefined}
				minDetail={Constants.nameBasicFilter.month} maxDetail={Constants.nameBasicFilter.month}
				locale={metadataLanguage}
				onActiveStartDateChange={changeActiveStartDateChange}
				tileClassName={({ date }) => {		
					if (Object.keys(calendarMeetings).length > 0 && calendarMeetings?.listDatemeetingsPerMonth?.data) {
						if (calendarMeetings.listDatemeetingsPerMonth.data.length > 0) {
							const listDatemeetingsPerMonth = calendarMeetings.listDatemeetingsPerMonth.data
						
							const dateMark = listDatemeetingsPerMonth.find(meetingDateString => {
								const meetingDate = new Date(meetingDateString);
								if (date.getFullYear() === meetingDate.getFullYear() && date.getMonth() === meetingDate.getMonth() && date.getDate() === meetingDate.getDate()) return true;
							});
								
							return dateMark ? highlight : '';
						}
					}
				}}
				{...props}
			/>
		</>
	);
};