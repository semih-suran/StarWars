import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { useResource } from "./useResource";
import type { APIResponse } from "../types";

function TestHarness({
  fetcher,
  resourceKey,
  page = 1,
  search = "",
}: {
  fetcher: (page?: number, search?: string) => Promise<APIResponse<any>>;
  resourceKey: string;
  page?: number;
  search?: string;
}) {
  const { data, loading, error } = useResource(fetcher, resourceKey, page, search);

  if (loading) return <div>LOADING</div>;
  if (error) return <div>ERROR: {error.message}</div>;
  return <div>DATA: {data?.[0]?.name ?? "NO DATA"}</div>;
}

describe("useResource hook", () => {
  it("fetches data correctly and renders the first item's name", async () => {
    const mockData = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: "Luke", url: "/people/1/" }],
    } as APIResponse<{ name: string; url: string }>;

    const fetcher = vi.fn().mockResolvedValue(mockData);

    render(<TestHarness fetcher={fetcher} resourceKey="test-people-1" page={1} />);

    // initial loading state shown
    expect(screen.getByText("LOADING")).toBeTruthy();

    // wait for the data to appear
    await waitFor(() => {
      expect(screen.getByText("DATA: Luke")).toBeTruthy();
    });

    // ensure fetcher called with correct args
    expect(fetcher).toHaveBeenCalledWith(1, "");
  });

  it("handles fetcher errors and shows error message", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("fetch failed"));

    render(<TestHarness fetcher={fetcher} resourceKey="test-people-err" page={1} />);

    // initial loading present
    expect(screen.getByText("LOADING")).toBeTruthy();

    // wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/ERROR:/)).toBeTruthy();
      expect(screen.getByText("ERROR: fetch failed")).toBeTruthy();
    });

    expect(fetcher).toHaveBeenCalledWith(1, "");
  });
});
