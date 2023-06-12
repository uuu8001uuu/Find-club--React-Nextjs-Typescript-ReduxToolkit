import { TypeClickButton } from './Login.types';
import styles from './Login.module.css';
import cn from 'classnames';
import React, { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react"
import Image from 'next/image';
import {iconUser} from './images';
import { Button } from '../../components';

export const Login = (): JSX.Element => {
	const router = useRouter();
	const loginRef = useRef(null);
	const [userHover, setUserHover] = useState(false);
	const { data: session, status } = useSession();
	const pathIconUser = session?.user?.image || iconUser;

	const handleUserMouseEnter = () => {
		setUserHover(true);
	}
	
	const handleUserMouseLeave = () => {
		setUserHover(false);
	}

	const handleClickSignIn = (e: TypeClickButton) => {
		e.preventDefault();
		signIn();
		router.back()
	}

	const handleClickSignOut = (e: TypeClickButton) => {
		e.preventDefault();
		if (router.pathname === '/propose-meeting') {
			signOut({ callbackUrl: '/' });
			return;
		}
		if (router.pathname === '/your-meetings') {
			signOut({ callbackUrl: '/' });
			return;
		}
		signOut({ callbackUrl: router.asPath });
	}

	function useOutsideClick(ref: RefObject<HTMLSelectElement>) {
		useEffect(() => {
			function handleClickOutside(event: Event) {
				if (ref.current && !ref.current.contains(event.target as Node)) setUserHover(false);
			}
			document.addEventListener("mousedown", handleClickOutside);
			
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}, [ref]);
	}
	

	useOutsideClick(loginRef);
	
	return (
		<>
      <div ref={loginRef} className={cn(styles.login, {[styles.active]: userHover})} onMouseEnter={handleUserMouseEnter}>
				<div className={styles.header}  onClick={handleUserMouseEnter}>
					<Image  className={styles.image} src={pathIconUser} alt="icon" width={48} height={48} />
				</div>
				<div className={cn(styles.main)} onMouseLeave={handleUserMouseLeave}>
					<div className={styles.description}>
						{!session && (
							<div>
								<span>Вы не вошли в систему</span>
								<Button
									name={'Войти Sign in'}
									onClick={(e) => handleClickSignIn(e)}
								/>
							</div>
						)}
						{session?.user && (
							<div>
								<h3>Добро пожаловать</h3>
								<span>{session.user.name ?? session.user.email}</span>
								<Button
									name={'Выйти Sign out'}
									onClick={(e) => handleClickSignOut(e)}
								/>
							</div>
						)}
					</div>
				</div>
      </div>
		</>
	);
};