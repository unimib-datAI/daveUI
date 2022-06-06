import { Flex } from "@/components";
import { NERAnnotation } from "@/server/routers/document";
import styled from "@emotion/styled";
import { Button } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import AddCandidateForm from "./AddCandidateForm";
import { useToggle } from "@/hooks";

type AddLinkItemProps = {
  setAnnotation: Dispatch<SetStateAction<NERAnnotation | undefined>>;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
  width: '100%'
})

const AddLinkItem = ({ setAnnotation }: AddLinkItemProps) => {
  const [formVisible, toggleFormVisibility] = useToggle(false);

  return (
    <Flex direction="column" gap="5px">
      <Container>
        <Button
          auto
          icon={<FiPlus size="20px" />}
          onClick={() => toggleFormVisibility()}>
          Add candidate
        </Button>
      </Container>
      {formVisible && <AddCandidateForm />}
    </Flex>
  )
};

export default AddLinkItem;