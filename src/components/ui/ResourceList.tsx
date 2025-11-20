import React from "react";
import { useLocation } from "react-router-dom";
import { usePaginationStore } from "../../store/usePaginationStore";
import { useSearchStore } from "../../store/useSearchStore";
import { useResource } from "../../hooks/useResource";
import { Pagination } from "./Pagination";
import { Loading } from "./Loading";
import { ErrorState } from "./ErrorState";
import { useModalStore } from "../../store/useModalStore";

type ResourceListProps<T> = {
  resourceKey: string;
  fetchFn: (page?: number, search?: string) => Promise<any>;
  renderCard: (item: T) => React.ReactNode;
};

export function ResourceList<T>({
  resourceKey,
  fetchFn,
  renderCard,
}: ResourceListProps<T>) {
  const location = useLocation();
  const urlQuery = new URLSearchParams(location.search);
  const qFromUrl = urlQuery.get("q") ?? "";

  const globalQ = useSearchStore((s) => s.query);
  const setGlobalQ = useSearchStore((s) => s.setQuery);

  const activeQuery = qFromUrl || globalQ || "";

  const currentPage = usePaginationStore((s) => s.getPage(resourceKey));
  const setPage = usePaginationStore((s) => s.setPage);

  const { data, count, next, previous, loading, error, refetch } =
    useResource<T>(fetchFn, resourceKey, currentPage, activeQuery);

  React.useEffect(() => {
    if (qFromUrl && qFromUrl !== globalQ) setGlobalQ(qFromUrl);
  }, [qFromUrl]);

  const onChangePage = (newPage: number) => {
    setPage(resourceKey, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = useModalStore((s) => s.openModal);

  if (loading && !data) return <Loading />;

  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const gridClass =
    "grid gap-4 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {resourceKey}
        </h1>
        <div className="text-sm text-gray-400">Total: {count}</div>
      </div>

      <div className={gridClass}>
        {data && data.length > 0 ? (
          data.map((item: any, i: number) => {
            const url = item.url ?? item.homeworld ?? "";
            return (
              <div
                key={item.url ?? i}
                role="button"
                tabIndex={0}
                onClick={() => url && openModal(resourceKey, url)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    url && openModal(resourceKey, url);
                  }
                }}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-sw-yellow rounded"
                aria-label={`Open ${resourceKey} details`}
              >
                {renderCard(item)}
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-gray-400 p-6">
            No results found
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        nextUrl={next}
        prevUrl={previous}
        onChangePage={onChangePage}
        totalCount={count}
      />
    </section>
  );
}
