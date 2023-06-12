import { TypeItemMessage } from './Alert.types';
import styles from './Alert.module.css';
import React, { useEffect } from 'react';
import cn from 'classnames';
import {iconDone, iconInfo, iconWarning, iconDanger} from './images';
import Image from 'next/image';
import { AlertsSlice } from '../../store/slices'
import { useAppDispatch, useAppSelector } from '../../store/hook'

export const Alert = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const listMessages: TypeItemMessage[] = useAppSelector(state => AlertsSlice.alertsSelect(state));

	const firstLetterUpperCase = (word: string) => {
		if (word?.length) return word.charAt(0).toUpperCase() + word.slice(1);
		return word;
	}

	const pathCurrentIcon = {
		'success': iconDone,
		'info': iconInfo,
		'warning': iconWarning,
		'danger': iconDanger
	}

	const handleClickRemove = (idMessage: string) => {
		dispatch(AlertsSlice.removeMessage(idMessage));
	}

	useEffect(() => {
		const interval = setTimeout(() => {	
			if (listMessages[0]?.id) handleClickRemove(listMessages[0].id)
		}, 3000);			
		return () => clearTimeout(interval);
	}, [listMessages])

	useEffect(() => {
		return () => {
			dispatch(AlertsSlice.removeAll())
		}
	}, [])

	return (
		<>
			<div className={styles.content}>
				{listMessages.length > 0 && listMessages.map(message => (
						<div
							className={cn(styles.alert, {[styles.alertSuccess]: message.typeAlert === 'success',[styles.alertInfo]: message.typeAlert === 'info', [styles.alertWarning]: message.typeAlert === 'warning', [styles.alertDanger]: message.typeAlert === 'danger'})}
							key={message.id}
						>
							<div className={styles.icon}>
								<Image src={message.typeAlert ? pathCurrentIcon[message.typeAlert] : ''} width={30} height={30} alt='icon' />
							</div>
							<div className={styles.text}>
								{message.title && <span><strong>{firstLetterUpperCase(message.title)}!</strong></span>}
								<span>{message.message}</span>
							</div>
							<button type="button" className={styles.close} onClick={() => handleClickRemove(message.id)}>×</button>
						</div>
					))
				}
			</div>
		</>
	);
};