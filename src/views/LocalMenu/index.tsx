import SelectMark from '../../components/SelectMark';
import GridSize from '../../components/GridSize';
import PlayerInputs from './PlayerInputs';
import Button from '../../components/Button/Button';

function LocalMenu() {
  return (
    <main>
      <h1>Settings</h1>
      <PlayerInputs />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />
      <div className="button-group-center">
        <Button linkTo="/local/game" text="Start Game" />
        <Button linkTo="/" text="Back" />
      </div>
    </main>
  );
}

export default LocalMenu;
