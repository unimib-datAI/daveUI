import AnnotationTag from "./AnnotationTag/AnnotationTag";
import { Annotation, AnnotationClickEvent, DocumentNode } from "./NERDocumentViewer";

export const getTextSelection = () => {
  const selection = window.getSelection();
  if (!selection || !selection.anchorNode || selection.anchorOffset === selection.focusOffset) {
    return null;
  }
  return selection;
}

export const getNode = (selection: Selection) => {
  const { anchorNode, anchorOffset, focusOffset } = selection;
  if (!anchorNode || !anchorNode.nodeValue) {
    return null;
  }

  const startOffsetNode = anchorOffset > focusOffset ? focusOffset : anchorOffset;
  const endOffsetNode = startOffsetNode === anchorOffset ? focusOffset : anchorOffset;
  return {
    anchorNode: anchorNode.nodeValue,
    startOffsetNode,
    endOffsetNode
  }
}

export const getOriginalOffset = (nodes: DocumentNode[], anchorNode: string, anchorSelectionStartOffset: number) => {
  let startOffset = 0;

  for (const node of nodes) {
    if (node === anchorNode) {
      startOffset += anchorSelectionStartOffset;
      return startOffset;
    }
    if (typeof node === 'string') {
      startOffset += node.length;
    } else {
      startOffset += node.props.children.length;
    }
  }
  return startOffset;
}

type RenderProps = {
  content: string;
  annotations: Annotation[];
  onEntityClick: (event: AnnotationClickEvent) => void;
}

export const _render = ({
  content,
  annotations,
  onEntityClick
}: RenderProps) => {
  let contentToRender: DocumentNode[] = [];
  let lastPosition = 0;

  annotations.forEach((annotation, index) => {
    const { id, start_pos_original, end_pos_original } = annotation;
    // node of type text
    const nodeText = content.slice(lastPosition, start_pos_original);
    const entity = content.slice(start_pos_original, end_pos_original);
    // node of type entity
    const nodeEntity = (
      <AnnotationTag
        key={id}
        annotation={annotation}
        onClick={() => onEntityClick({ annotation })}>
        {entity}
      </AnnotationTag>
    )
    contentToRender.push(nodeText);
    contentToRender.push(nodeEntity)

    lastPosition = end_pos_original;
  });
  const residualText = content.slice(lastPosition, content.length);
  contentToRender.push(residualText);

  return contentToRender;
}