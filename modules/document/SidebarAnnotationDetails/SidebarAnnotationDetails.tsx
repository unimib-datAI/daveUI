import styled from "@emotion/styled";
import { Button, Col, Divider, Text } from "@nextui-org/react";
import TextAnnotationDetails from "./AnnotationTextDetails";
import AnnotationLinkDetails from "./AnnotationLinkDetails";
import { EditAnnotationModal } from "./EditAnnotationModal";
import useModal from "@/hooks/use-modal";
import { selectDocumentData, useSelector } from "../DocumentProvider/selectors";
import { EntityAnnotation } from "@/server/routers/document";
import { getCandidateId } from "../DocumentProvider/utils";

type AnnotationDetailsProps = {
  annotation: EntityAnnotation;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
})

const DetailsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '10px 14px',
  overflowY: 'scroll',
  '::-webkit-scrollbar': {
    height: '4px',
    width: '2px'
  },
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(0,0,0,0.1)'
  }
})

const ButtonContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px',
  marginTop: 'auto'
})

const AnnotationDetails = ({ annotation }: AnnotationDetailsProps) => {
  const data = useSelector(selectDocumentData);
  const { setVisible, bindings } = useModal();
  const { top_candidate, candidates } = annotation.features.linking;

  if (!data) {
    return null;
  }

  return (
    <>
      <Container>
        <DetailsContainer>
          <Col>
            <Text b size={18}>Annotation details</Text>
            <Text css={{ fontSize: '16px', lineHeight: '1', color: 'rgba(0,0,0,0.5)' }}>
              Inspect the details for a selected annotation.
            </Text>
          </Col>
          <Divider />
          <TextAnnotationDetails text={data.text} annotation={annotation} />
          <AnnotationLinkDetails selectedId={getCandidateId(top_candidate)} candidates={candidates} />
        </DetailsContainer>
        <ButtonContainer>
          <Button onClick={() => setVisible(true)}>Edit</Button>
        </ButtonContainer>
      </Container>
      <EditAnnotationModal setVisible={setVisible} {...bindings} />
    </>
  )
}

export default AnnotationDetails;
