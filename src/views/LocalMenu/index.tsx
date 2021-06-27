import PlayerInputs from './PlayerInputs';
import SelectMark from '../../components/SelectMark';
import GridSize from '../../components/GridSize';
import StartButton from '../../components/StartButton';
import BackButton from '../../components/BackButton';

function LocalMenu() {
  return (
    <main>
      <h1>Settings</h1>
      <PlayerInputs />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />
      <div className="button-group-center">
        <StartButton text="Start Game" linkTo="/local/game" />
        <BackButton />
      </div>
    </main>
  );
}

export default LocalMenu;
