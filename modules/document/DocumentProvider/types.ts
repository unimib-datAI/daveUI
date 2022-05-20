import { DocumentState } from "@/lib/useQueryDocument";
import { TreeItem } from "../SidebarAddAnnotation/Tree";
import { FlatTreeObj } from "../SidebarAddAnnotation/Tree";

export type Action =
  | { type: 'setData', payload: { data: DocumentState } }
  | { type: 'changeAction', payload: { action: State['ui']['action'], data?: string } }
  | { type: 'addAnnotation' }
  | { type: 'deleteAnnotation' }
  | { type: 'addType', payload: { label: string, color?: string, path: string } };
export type Dispatch = (action: Action) => void

export type AnnotationType = {
  label: string;
  color: string;
  children?: Record<string, Omit<AnnotationType, 'color'>>
};
export type AnnotationTypeMap = Record<string, AnnotationType>;

export type UIAction = 'select' | 'add' | 'delete' | 'filter';

export type Taxonomy = TreeItem[];
export type FlattenedTaxonomy = FlatTreeObj

export type State = {
  /**
   * Document data
   */
  data: DocumentState | undefined;
  /**
   * Taxonomy in tree structure
   */
  types: Taxonomy,
  /**
   * Flattened taxonomy for easier access
   */
  flattenedTypes: FlattenedTaxonomy,
  ui: {
    action: {
      value: UIAction;
      data?: string;
    };
  }
}


