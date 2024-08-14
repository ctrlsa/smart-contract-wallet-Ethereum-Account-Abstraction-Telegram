import { List } from '@telegram-apps/telegram-ui';
import { type FC } from 'react';



import { LoginButton } from '@/components/LoginButton/LoginButton';

export const IndexPage: FC = () => {
  return (

    <List>
        <LoginButton></LoginButton>
    </List>
  );
};
