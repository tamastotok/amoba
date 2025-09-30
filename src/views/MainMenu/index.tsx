import socket from '../../server';
import Button from '../../components/Button/Button';

interface MainMenuProps {
  status: boolean;
  serverStatusMessage: string;
}

function MainMenu({ status, serverStatusMessage }: MainMenuProps) {
  const handleClick = () => {
    socket.emit('join-lobby');
  };

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <div className="button-group-center">
        <Button linkTo="/local" text="Local" />
        <Button
          linkTo={status ? '/online' : '/'}
          clickEvent={handleClick}
          text="Online"
          isDisabled={!status}
        />
      </div>
      <h2 className="server-status">{serverStatusMessage}</h2>
    </main>
  );
}

export default MainMenu;
