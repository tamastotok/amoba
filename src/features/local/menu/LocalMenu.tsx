import SelectMark from '@/components/game/SelectMark';
import PlayerInputs from './PlayerInputsLocal';
import GridSize from '@/components/game/GridSize';
import BoxWrapper from '@/components/ui/BoxWrapper';
import Button from '@/components/ui/Button';

function LocalMenu() {
  return (
    <>
      <PlayerInputs />
      <SelectMark label="Start game with:" mark="starterMark" />
      <GridSize />
      <BoxWrapper>
        <Button linkTo="/local/game" text="Start Game" />
        <Button linkTo="/" text="Back" />
      </BoxWrapper>
    </>
  );
}

export default LocalMenu;
