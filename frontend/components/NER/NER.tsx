import useNER from '@/lib/ner/core/use-ner';
import { FlattenedTaxonomy } from '@/modules/document/DocumentProvider/types';
import { getAllNodeData } from '@/components/Tree';
import { EntityAnnotation, SectionAnnotation } from '@/server/routers/document';
import styled from '@emotion/styled';
import {
  useCallback,
  useMemo,
  MouseEvent,
  ReactNode,
  useRef,
  useEffect,
  useState,
} from 'react';
import EntityNode from './EntityNode';
import { NERContext } from './nerContext';
import Section from './Section';
import TextNode, { SelectionNode } from './TextNode';
import { SectionsList } from '../SectionsList';
import { getStartAndEndIndexForPagination } from '@/utils/shared';

type NERProps = {
  text: string;
  page: number;
  entityAnnotations: EntityAnnotation[];
  sectionAnnotations?: SectionAnnotation[];
  taxonomy: FlattenedTaxonomy;
  highlightAnnotation?: number | null;
  isAddMode?: boolean;
  addSelectionColor?: string;
  showAnnotationDelete?: boolean;
  renderContentHover?: (annotation: EntityAnnotation) => ReactNode;
  onTextSelection?: (event: MouseEvent, node: SelectionNode) => void;
  onTagClick?: (event: MouseEvent, annotation: EntityAnnotation) => void;
  onTagEnter?: (event: MouseEvent, annotation: EntityAnnotation) => void;
  onTagLeave?: (event: MouseEvent, annotation: EntityAnnotation) => void;
  onTagDelete?: (event: MouseEvent, annotation: EntityAnnotation) => void;
};

const NodesContainer = styled.div({
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  lineHeight: 1.7,
});

const NER = ({
  text,
  entityAnnotations,
  sectionAnnotations,
  taxonomy,
  page,
  ...props
}: NERProps) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6000);
  const nodes = useNER({
    text: text,
    page: page,
    entities: entityAnnotations,
    sections: sectionAnnotations,
  });
  const getTaxonomyNode = useCallback(
    (key: string) => {
      const node = getAllNodeData(taxonomy, key);
      return node;
    },
    [taxonomy]
  );
  const contextValue = useMemo(
    () => ({
      getTaxonomyNode,
      ...props,
    }),
    [props, getTaxonomyNode]
  );
  useEffect(() => {
     const { startIndex, endIndex } = getStartAndEndIndexForPagination(
       page,
       text
     );
      setStartIndex(startIndex);
      setEndIndex(endIndex);
  }, [page]);

  return (
    <NERContext.Provider value={contextValue}>
      <NodesContainer
        
      >
        {nodes.map((node) => {
         
          if (node.start >= startIndex && node.end <= endIndex) {
            if (node.type === 'section') {
              return (
                <Section {...node}>
                  {node.contentNodes.map(({ key, ...nodeProps }) => {
                    if (nodeProps.type === 'text') {
                      return <TextNode key={key} {...nodeProps} />;
                    }
                    return <EntityNode key={key} {...nodeProps} />;
                  })}
                </Section>
              );
            }
            if (node.type === 'text') {
              return <TextNode {...node} />;
              return null;
            }
            const { key, ...props } = node;
            return <EntityNode key={key} {...props} />;
          }
        })}
      </NodesContainer>
    </NERContext.Provider>
  );
};

export default NER;
