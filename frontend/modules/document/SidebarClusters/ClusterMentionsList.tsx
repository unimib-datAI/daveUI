import { Cluster, EntityAnnotation } from '@/server/routers/document';
import styled from '@emotion/styled';
import { Text } from '@nextui-org/react';
import { Fragment, MouseEvent, useState } from 'react';
import { scrollEntityIntoView } from '../DocumentProvider/utils';
import { FiArrowRight } from '@react-icons/all-files/fi/FiArrowRight';
import {
  selectDocumentText,
  useDocumentDispatch,
  useSelector,
} from '../DocumentProvider/selectors';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { documentPageAtom } from '@/utils/atoms';
import { getStartAndEndIndexForPagination } from '@/utils/shared';

type ClusterMentionsListProps = {
  mentions: (Cluster['mentions'][number] & { mentionText: string })[];
  annotations: EntityAnnotation[];
};

const ListContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  width: '100%',
});

const MentionButton = styled.button({
  position: 'relative',
  background: '#FFF',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '12px',
  border: '1px solid #F3F3F5',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'start',
  transition: 'background 250ms ease-out, transform 150ms ease-out',
  '&:active': {
    background: '#ececec',
    transform: 'scale(0.95)',
  },
  '&:hover': {
    paddingRight: '20px',
    background: '#fcfcfc',
    '> div': {
      visibility: 'visible',
      transform: 'translateY(-50%) translateX(10%)',
    },
  },
});

const IconButtonContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '50%',
  right: '5px',
  transform: 'translateY(-50%)',
  transition: 'transform 150ms ease-out',
  visibility: 'hidden',
});

const Mark = styled.mark({
  background: '#f7f7a2',
});

const highlightMatchingText = (text: string, matchingText: string) => {
  const matchRegex = RegExp(matchingText, 'ig');

  // Matches array needed to maintain the correct letter casing
  const matches = [...Array.from(text.matchAll(matchRegex))];

  return text.split(matchRegex).map((nonBoldText, index, arr) => (
    <Fragment key={index}>
      {nonBoldText}
      {index + 1 !== arr.length && <Mark>{matches[index]}</Mark>}
    </Fragment>
  ));
};

const ClusterMentionsList = ({
  mentions,
  annotations,
}: ClusterMentionsListProps) => {
  // const dispatch = useDocumentDispatch();
  const router = useRouter();
  const text = useSelector(selectDocumentText);
  const [page, setPage] = useAtom(documentPageAtom);
  const handleOnClick = (id: number, mention: any) => (event: MouseEvent) => {
    event.stopPropagation();

    if (annotations[id]) {
      setPage(Math.floor(annotations[id].start / 4000) + 1);
    }
    router.push(`/documents/${router.query.id}?annotationId=${id}`, undefined, {
      shallow: true,
    });
  };

  return (
    <ListContainer>
      {mentions.map((m) => (
        <MentionButton
          title={m.mentionText}
          onClick={handleOnClick(m.id, m)}
          key={m.id}
        >
          {highlightMatchingText(m.mentionText, m.mention)}
          <IconButtonContainer>
            <FiArrowRight />
          </IconButtonContainer>
        </MentionButton>
      ))}
    </ListContainer>
  );
};

export default ClusterMentionsList;
