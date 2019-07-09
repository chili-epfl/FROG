import * as React from 'React'; 
import {Modal} from '../Wiki/components';
import SignUp from './SignUp';


type SignUpModalPropsT = {
  hideModal: () => void
};


const SignUpModal = ({hideModal }: SignUpModalPropsT) => {
  return (
   <Modal
      title=""
      actions={[{ title: 'Cancel', callback: hideModal }]}
    >
    <SignUp/>

    </Modal>

   );
 }


