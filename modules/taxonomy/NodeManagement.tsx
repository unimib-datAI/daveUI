import { Button } from "@/components";
import TagList from "@/components/TagList";
import { FlatTreeNode } from "@/components/TreeSpecialization";
import { useForm, useParam } from "@/hooks";
import { ContentProps } from "@/pages/taxonomy";
import styled from "@emotion/styled";
import { Input, Text } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Description from "./Description";
import { useSelector, useTaxonomyDispatch } from "./TaxonomyProvider/selectors";

type NodeManagementProps = {
  typeKey: string;
  onSubmit: (value: NodeManagementFormState) => void;
  addNode?: boolean;
}

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
})

const Row = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px'
})

export type NodeManagementFormState = {
  label: string;
  key: string;
  terms: string[];
}


const NodeManagement = ({ typeKey, addNode, onSubmit: onSubmitProp }: NodeManagementProps) => {
  const taxonomyNode = useSelector((state) => state.taxonomy[typeKey]);

  const { isDirty, register, onSubmit, setValue } = useForm<NodeManagementFormState>({
    label: '',
    key: '',
    terms: []
  });

  useEffect(() => {
    setValue({
      label: addNode ? '' : taxonomyNode.label,
      key: addNode ? '' : taxonomyNode.key,
      terms: addNode ? [] : (taxonomyNode.terms || [])
    })
  }, [taxonomyNode, addNode]);

  // const handleSubmit = (value: FormState) => {
  //   if (addNode) {
  //     dispatch({
  //       type: 'addType',
  //       payload: {
  //         ...value,
  //         parent: typeKey
  //       }
  //     });
  //   } else {
  //     // c'è un problema con l'edit. la Key non deve essere anche la chiave del dizionario. Se pensiamo a mongo ad esempio è l'id di mongo. Quindi simulerei questa cosa
  //     dispatch({
  //       type: 'editType',
  //       payload: {
  //         oldKey: typeKey,
  //         newNode: value
  //       }
  //     });
  //   }
  // }

  return (
    <Container as="form" onSubmit={onSubmit(onSubmitProp)}>
      <Row>
        <Input size="lg" {...register('label')} label="Nome" placeholder="Nome del tipo" />
        <Input size="lg" {...register('key')} label="Tag" placeholder="Tag del tipo" />
      </Row>
      <Text>{`Aggiungi i termini più rappresentativi per il tipo:`}</Text>
      <TagList {...register('terms')} />
      <Button
        type="submit"
        disabled={!isDirty}
        auto
        css={{
          marginRight: 'auto'
        }}>
        Save
      </Button>
    </Container>
  );
}

export default NodeManagement