import { createImmerReducer } from "@/utils/immerReducer";
import { removeProps } from "@/utils/shared";
import { FlatTreeNode, getNodeAndChildren } from "../SidebarAddAnnotation/Tree";
import { State, Action } from "./types";
import { addAnnotation, getAnnotationTypes, getEntityId, getTypeFilter, isSameAction, toggleLeftSidebar } from "./utils";

export const documentReducer = createImmerReducer<State, Action>({
  setData: (state, payload) => {
    state.data = payload.data;
  },
  changeAction: (state, payload) => {
    toggleLeftSidebar(state, payload);
    state.ui.action.value = payload.action;
    state.ui.action.data = undefined;
  },
  changeActionData: (state, payload) => {
    state.ui.action.data = payload.data
  },
  setCurrentEntityId: (state, payload) => {
    state.ui.selectedEntityId = payload.annotationId;
  },
  addAnnotation: (state, payload) => {
    const { views } = state.ui
    const { viewIndex, type, startOffset, endOffset, text } = payload;
    const { activeAnnotationSet, typeFilter } = views[viewIndex];

    const {
      next_annid,
      annotations
    } = state.data.annotation_sets[activeAnnotationSet];

    const newAnnotation: any = {
      id: next_annid,
      start: startOffset,
      end: endOffset,
      type: type,
      features: {
        mention: text,
        ner: {},
        linking: {}
      }
    }
    state.data.annotation_sets[activeAnnotationSet].annotations = addAnnotation(annotations, newAnnotation);
    state.data.annotation_sets[activeAnnotationSet].next_annid = next_annid + 1;

    if (typeFilter.indexOf(type) === -1) {
      typeFilter.push(type);
    }
  },
  editAnnotation: (state, payload) => {
    const { views, selectedEntityId } = state.ui;
    if (!selectedEntityId) {
      return state;
    }

    const { annotationId, type, topCandidate } = payload;
    const viewIndex = getEntityId(selectedEntityId)[0];

    const { activeAnnotationSet } = views[viewIndex];
    const { annotations } = state.data.annotation_sets[activeAnnotationSet];
    const newAnnotations = annotations.map((ann) => {
      if (ann.id === annotationId) {
        return {
          ...ann,
          type,
          features: {
            ...ann.features,
            linking: {
              ...ann.features.linking,
              top_candidate: topCandidate
            }
          }
        }
      }
      return ann;
    });
    state.data.annotation_sets[activeAnnotationSet].annotations = newAnnotations;
    state.ui.views[viewIndex].typeFilter = getTypeFilter(newAnnotations);
  },
  deleteAnnotation: (state, payload) => {
    const { views } = state.ui;
    const { viewIndex, id } = payload;
    const { activeAnnotationSet } = views[viewIndex];
    const { annotations } = state.data.annotation_sets[activeAnnotationSet];
    const newAnnotations = annotations.filter((ann) => ann.id !== id);
    state.data.annotation_sets[activeAnnotationSet].annotations = newAnnotations;
    state.ui.views[viewIndex].typeFilter = getTypeFilter(newAnnotations);
  },
  addTaxonomyType: (state, payload) => {
    const { type } = payload;
    const { key, label, parent, ...rest } = type;

    const newType = {
      key,
      label,
      ...(!parent && { ...rest }),
      recognizable: false,
      parent: parent || null
    } as FlatTreeNode

    state.taxonomy[key] = newType;
  },
  deleteTaxonomyType: (state, payload) => {
    const { taxonomy } = state;
    const { key } = payload;

    const types = getNodeAndChildren(taxonomy, key, (node) => node.key);

    Object.values(state.data.annotation_sets).forEach((annSet) => {
      if (annSet.name.startsWith('entities')) {
        annSet.annotations = annSet.annotations.filter((ann) => types.indexOf(ann.type) === -1);
      }
    })

    state.ui.views.forEach((view) => {
      const indexToRemove = view.typeFilter.indexOf(key);
      if (indexToRemove !== -1) {
        view.typeFilter.splice(indexToRemove, 1);
      }
    })
    state.ui.selectedEntityId = null;
    state.taxonomy = removeProps(taxonomy, types)

  },
  changeAnnotationSet: (state, payload) => {
    const { annotationSet, viewIndex } = payload;
    const { annotations } = state.data.annotation_sets[annotationSet]

    state.ui.views[viewIndex].typeFilter = getTypeFilter(annotations);
    state.ui.views[viewIndex].activeAnnotationSet = annotationSet;
  },
  setView: (state, payload) => {
    const { viewIndex, view } = payload;
    state.ui.views[viewIndex] = {
      ...state.ui.views[viewIndex],
      ...view
    }
  },
  addView: (state) => {
    state.ui.views = [
      ...state.ui.views,
      state.ui.views[0]
    ]
  },
  removeView: (state) => {
    state.ui.views.splice(1, 1);
  },
  setUI: (state, payload) => {
    state.ui = {
      ...state.ui,
      ...payload
    }
  }
})
