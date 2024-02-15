import { useEffect } from 'react';
import userService from '../user/user.service';

const usePageCloseDetection = (onCloseAction: () => void) => {
	useEffect(() => {
		const handlePageClose = (event: BeforeUnloadEvent) => {
			onCloseAction();
			userService.changeUserStatus("offline").then(() => {
				event.preventDefault();
				event.returnValue = '';
			})

		};
		
		window.addEventListener('beforeunload', handlePageClose);
		// Detach the event listener when the component unmounts
		return () => {
			window.removeEventListener('beforeunload', handlePageClose);
		};
	}, [onCloseAction]);
};

export default usePageCloseDetection;