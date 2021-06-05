import PlayerInputs from './PlayerInputs';
import SelectMark from '../SelectMark';
import GridSize from '../GridSize';
import StartBackButtons from './StartBackButtons';

function LocalMenu() {
  return (
    <main>
      <h1>Settings</h1>
      <PlayerInputs />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />
      <StartBackButtons />
    </main>
  );
}

export default LocalMenu;
