import { useWallet, WalletStatus } from '@terra-dev/use-wallet';
import Button from 'react-bootstrap/Button';

export const ConnectWallet = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
  } = useWallet();

  return (
    <div>
      {status === WalletStatus.WALLET_NOT_CONNECTED && (
        <>
          {availableInstallTypes.map((connectType) => (
            <>
              <Button
                key={`install-${connectType}`}
                onClick={() => install(connectType)}
                type='button'
                variant='outline-secondary'
              >
                Install {connectType}
              </Button>{' '}
            </>
          ))}
          {availableConnectTypes.map((connectType) => (
            <>
              <Button
                variant='outline-secondary'
                key={`connect-${connectType}`}
                onClick={() => connect(connectType)}
                type='button'
              >
                Connect {connectType}
              </Button>{' '}
            </>
          ))}
        </>
      )}
    </div>
  );
};
