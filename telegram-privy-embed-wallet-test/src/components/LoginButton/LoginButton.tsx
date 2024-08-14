import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth';
import { FC, useState } from 'react';

export const LoginButton: FC = () => {
  const {ready, authenticated} = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  const [userData, setUserData] = useState('');

  const {login} = useLogin({
    onComplete: (user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount) => {
      // console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod, linkedAccount);
      console.log('user', user);
      console.log('isNewUser', isNewUser);
      console.log('wasAlreadyAuthenticated', wasAlreadyAuthenticated);
      console.log('loginMethod', loginMethod);
      console.log('linkedAccount', linkedAccount);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
      setUserData(JSON.stringify(user, null, 2));
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  const {logout} = useLogout({
    onSuccess: () => {
      // Any logic you'd like to execute if the user is logged out while this component is mounted
      setUserData('');
    }
  });

  return (
    <>
      <button disabled={disableLogin} onClick={login}>
        Log in
      </button>
      <button onClick={logout}>
        Log out
      </button>
      <div>
        <textarea 
            value={userData} 
            readOnly 
            rows={100} 
            cols={80}
          />
      </div>    
    </>
  );
}