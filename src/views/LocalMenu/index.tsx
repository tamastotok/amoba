import SelectMark from '../../components/SelectMark';
import GridSize from '../../components/GridSize';
import PlayerInputs from './PlayerInputs';
import Button from '../../components/Button/Button';
import BoxWrapper from '../../components/BoxWrapper';

function LocalMenu() {
  return (
    <>
      <h1>Game Setup</h1>
      <PlayerInputs />
      <SelectMark label="Start game with:" whatMark="starterMark" />
      <GridSize />
      <BoxWrapper>
        <Button linkTo="/local/game" text="Start Game" />
        <Button linkTo="/" text="Back" />
      </BoxWrapper>
    </>
  );
}

export default LocalMenu;
