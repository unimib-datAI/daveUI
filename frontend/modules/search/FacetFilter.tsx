import { useForm } from "@/hooks";
import { Facet } from "@/server/routers/search";
import { Checkbox } from "@nextui-org/react";
import Fuse from "fuse.js";
import { Link, Link2, SearchIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

type FacetFilterProps = {
  facet: Facet;
  filterType: string;
};

const getFilters = (query: Record<string, string | string[] | undefined>, type: string, key: string) => {
  const queryKey = `${type}_${key}`;
  const value = query[queryKey];

  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value]

}

const FacetFilter = ({ facet, filterType }: FacetFilterProps) => {
  const { register, value } = useForm({
    filter: ''
  });
  const fuse = useRef(new Fuse(facet.children, {
    keys: filterType.startsWith('annotation') ? ['display_name'] : ['key']
  }))
  const router = useRouter();


  const [page, setPage] = useState(0);

  const MAX_VISIBLE_CHILDREN = 7;
  const STEP = 10
  const VISIBLE_ELEMENTS = page * STEP + MAX_VISIBLE_CHILDREN

  const filteredChildren = value.filter.trim() === '' ? facet.children.sort((a,b) => a.display_name.localeCompare(b.display_name) ) : fuse.current.search(value.filter).map(({ item }) => item)
  const children = filteredChildren.slice(0, VISIBLE_ELEMENTS);

  const filters = getFilters(router.query, filterType, facet.key)

  const handleChecked = (checked: boolean, key: string, keys: string[]) => {
    console.log('checked', checked, key, keys)
    let newFilters = []

    if (checked) {
      newFilters = [...filters, ...keys];
    } else {
      newFilters = filters.filter((f) => f !== key);
      let multipleFilters  = filters.filter((f) => !keys.includes(f));
      
    }
    const url = {
      pathname: router.pathname,
      query: {
        ...router.query,
        [`${filterType}_${facet.key}`]: newFilters
      }
    }
    console.log('final url', url )
    router.push(url, undefined, { shallow: true })
  }

  return (
    <div className="flex flex-col z-[1] gap-2">
      <div className="flex flex-row items-center gap-2">
        <span className="capitalize text-sm font-semibold">{facet.key}</span>
        <span className="text-xs text-slate-400">{`(${facet.n_children})`}</span>
      </div>

      <div className="flex flex-row items-center border-[1px] border-solid border-slate-200 rounded-md p-1 w-full gap-2">
        <SearchIcon size={16} />
        <input
          className="text-slate-800 resize-none bg-transparent w-full h-full border-none text-sm"
          spellCheck="false"
          placeholder={`Find ${facet.key}`}
          {...register('filter')}
        />
      </div>


      <div className="flex flex-col">
        {children.map((option) => {
          return (
            <Checkbox key={option.key} isSelected={filters.includes(option.key)} value={filterType === 'annotation' ? option.display_name : option.key} onChange={(checked) => handleChecked(checked, option.key, option.ids_ER)}>
              <div className="flex flex-row items-center gap-1">
                {option.is_linked && (
                  <span className="flex items-center justify-center rounded-md uppercase text-xs bg-blue-100 px-1 font-semibold p-[1px]"><Link className="h-3 w-3 text-black" /></span>
                )}
                <span className="text-base whitespace-nowrap text-ellipsis overflow-hidden w-48">{filterType === 'annotation' ? option.display_name : option.key}</span>
              </div>

            </Checkbox>
          )
        })}
      </div>

      {filteredChildren.length > MAX_VISIBLE_CHILDREN ? (
        <div className="flex flex-row justify-between">
          {page > 0 ? (
            <button onClick={() => setPage(0)} className="text-xs border-none bg-transparent flex justify-start m-0 p-0 font-semibold underline cursor-pointer">
              Show less
            </button>
          ) : null}
          {VISIBLE_ELEMENTS < facet.n_children ? (
            <button onClick={() => setPage((p) => p + 1)} className="text-xs border-none bg-transparent flex justify-start m-0 p-0 font-semibold underline cursor-pointer">
              {`Show ${STEP} more`}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { FacetFilter }