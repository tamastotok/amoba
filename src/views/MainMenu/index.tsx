import socket from '../../server';
import EventButton from '../../components/EventButton';

function MainMenu({ status, serverStatusMessage }: any) {
  const handleClick = () => {
    socket.emit('join-lobby');
  };

  return (
    <main>
      <h1>Tic-tac-toe</h1>
      <div className="button-group-center">
        <EventButton linkTo="/local" text="Local" />
        <EventButton
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
