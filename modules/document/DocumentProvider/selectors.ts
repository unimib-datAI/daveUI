import { useContext, useMemo } from "react";
import { buildTreeFromFlattenedObject } from "../SidebarAddAnnotation/Tree";
import { DocumentStateContext, DocumentDispatchContext } from "./DocumentContext";
import { State } from "./types";

/**
 * Access the document state within the DocumentProvider.
 */
export const useDocumentState = () => {
  const context = useContext(DocumentStateContext);

  if (context === undefined) {
    throw new Error('useDocumentState must be used within a DocumentProvider')
  }

  return context;
};

/**
 * Access the document disptach within the DocumentProvider.
 */
export const useDocumentDispatch = () => {
  const context = useContext(DocumentDispatchContext);

  if (context === undefined) {
    throw new Error('useDocumentDispatch must be used within a DocumentProvider')
  }

  return context;
};

/**
 * An hook to select the state partially
 */
export function useSelector<T>(cb: (state: State) => T) {
  const _state = useDocumentState();
  return cb(_state);
}

export function useMemoSelector<T>(cb: (state: State) => T, cbDeps: (state: State) => Array<any>) {
  const _state = useDocumentState();
  const deps = cbDeps(_state);
  const value = useMemo(() => {
    return cb(_state);
  }, deps);
  return value;
}

export const useDocumentData = () => useSelector((state) => state.data);

export const useDocumentText = () => useSelector((state) => state.data?.text);

export const useDocumentCurrentEntity = () => useMemoSelector(
  (state) => {
    const { data, ui: { selectedEntityId } } = state;
    if (!data || selectedEntityId == null) {
      return undefined;
    }
    return data.annotation.find((ann) => ann.id === selectedEntityId);
  },
  ({ ui: { selectedEntityId }, data }) => [selectedEntityId, data]
)
export const useDocumentAction = () => useSelector((state) => state.ui.action);

export const useDocumentTaxonomy = () => useSelector((state) => state.taxonomy);

export const useDocumentCallbacks = () => useSelector((state) => state.callbacks);

export const useDocumentTaxonomyTree = () => useMemoSelector(
  (state) => buildTreeFromFlattenedObject(state.taxonomy),
  ({ taxonomy }) => [taxonomy]);

export const useDocumentActiveType = () => useSelector((state) => state.ui.action.data);

export const useLeftActionBarOpen = () => useSelector((state) => state.ui.leftActionBarOpen);