import { useWallet } from '@terra-dev/use-wallet';
import Button from 'react-bootstrap/Button';

export const DisconnectWallet = () => {
  const { disconnect } = useWallet();

  return (
    <Button variant='outline-secondary' onClick={() => disconnect()}>
      Disconnect
    </Button>
  );
};
