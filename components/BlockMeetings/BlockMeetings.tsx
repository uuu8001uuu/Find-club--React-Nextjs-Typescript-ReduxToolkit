import styles from './BlockMeetings.module.css';
import { BlockMeetingsProps } from './BlockMeetings.props';
import cn from 'classnames';
import { useRouter } from 'next/router';
import {DivWithTopPanel, FilterMeetings, MeetingsList} from '../../components';
import { Constants } from '../../globals';
import { PaginationSlice } from '../../store/slices';
import { useAppDispatch } from '../../store/hook';
import { useEffect } from 'react';

export const BlockMeetings = ({}: BlockMeetingsProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const pageYourMeetings = router.pathname === '/your-meetings' || false;
	
	useEffect(() => {
		if (pageYourMeetings) {
			dispatch(PaginationSlice.clearAll());
		}

	}, [])
	
	return (
		<>
			<DivWithTopPanel
				topPanel={
					<>
						<FilterMeetings/>
					</>
				}
				meetingsListMain={pageYourMeetings ? false : true}
			>
				<MeetingsList
					namePagination={!pageYourMeetings && Constants.namePagination.meetingsList}
				/>
			</DivWithTopPanel>
		</>
	);
};