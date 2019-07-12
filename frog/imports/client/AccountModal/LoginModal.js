import * as React from 'react'; 
import {Modal} from '../Wiki/components/Modal'; 
import Login from './Login'; 

type LoginModalPropsT = {
	hideModal: () => void
}

export default function LoginModal({hideModal}: LoginModalPropsT){
	return(
	<Modal title = "" actions {[{title:'Cancel',callback:hideModal}]}>
	  <Login />
	</Modal> ); 
}