import { Source } from "@/server/routers/review";
import { useQuery } from "@/utils/trpc";
import styled from "@emotion/styled";
import { Row, Text } from "@nextui-org/react";
import { FiFolder } from "@react-icons/all-files/fi/FiFolder";
import { FiCheck } from "@react-icons/all-files/fi/FiCheck";
import { motion } from "framer-motion";
import Link from "next/link";
import LoadingOverlay from "@/modules/review/LoadingOverlay";

const OuterContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  gap: '20px'
})

const InnerContainer = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(256px,1fr))',
  gridGap: '32px 32px'
})
const FolderContainer = styled(motion.a)({
  borderRadius: '10px',
  padding: '10px',
  background: 'rgba(0,0,0,0.05)',
  transition: 'background 200ms ease-in-out',
  '&:hover': {
    background: 'rgba(0,0,0,0.07)'
  }
})

const FolderRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px'
})

const FolderContent = styled.div({
  display: 'flex',
  flexDirection: 'column'
})

const FolderIconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  borderRadius: '50%',
  background: '#FFF'
})

const DoneIconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px',
  borderRadius: '50%',
  background: 'rgba(93, 211, 158, 0.3)',
  marginLeft: 'auto'
})

const BackButton = styled(motion.a)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  fontSize: '32px',
  borderRadius: '50%',
  outline: 'none',
  border: 'none'
})


type FolderProps = Source;

const Folder = ({ id, name, total, done }: FolderProps) => {
  const isDone = total === done;

  return (
    <Link passHref href={`/review/${id}`}>
      <FolderContainer whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
        <FolderRow>
          <FolderIconContainer>
            <FiFolder />
          </FolderIconContainer>
          <FolderContent>
            <Text size="16px" css={{ fontWeight: 500 }}>
              {name}
            </Text>
            <Text size="14px" color="rgba(0,0,0,0.5)">{`${done}/${total} documents`}</Text>
          </FolderContent>
          {isDone && (
            <DoneIconContainer>
              <FiCheck />
            </DoneIconContainer>
          )}
        </FolderRow>
      </FolderContainer>
    </Link>

  )
}

const ReviewPage = () => {
  const { data, isFetching, isSuccess } = useQuery(['review.getAllSources']);

  const isLoading = isFetching && !data;

  if (isLoading) {
    <LoadingOverlay show={isLoading} />
  }

  return (
    <OuterContainer>
      <Row css={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Text h2>Review folders</Text>
        <Text css={{ fontSize: '24px', color: 'rgba(0,0,0,0.5)', alignSelf: 'flex-end' }}>{`${data?.sources.length} folders`}</Text>
      </Row>
      <InnerContainer>
        {data?.sources.map((source) => (
          <Folder key={source.id} {...source} />
        ))}
      </InnerContainer>
    </OuterContainer>
  )
};

export default ReviewPage;