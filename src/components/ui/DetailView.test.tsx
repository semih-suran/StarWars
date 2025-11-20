import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

describe("DetailView component", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("renders details and shows image", async () => {
    const dataUri =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    // Mock API before import
    vi.doMock("../../api/swapi", () => ({
      fetchByUrl: vi.fn(async () => ({
        name: "Luke",
        url: "/people/1/",
        homeworld: "/planets/1/",
        films: ["/films/1/"],
      })),
      fetchMultipleByUrls: vi.fn(async (urls) =>
        urls.map((u) => ({ name: "Film", url: u }))
      ),
    }));

    // Mock image provider
    vi.doMock("../../utils/imageProvider", () => ({
      getSafeImageForItem: vi.fn().mockResolvedValue(dataUri),
    }));

    const mod = await import("./DetailView");
    const DetailView = (mod as any).DetailView ?? (mod as any).default;

    render(<DetailView resource="people" url="/people/1/" />);

    // Title
    const title = await screen.findByRole("heading", { name: /luke/i });
    expect(title).toBeVisible();

    // Image
    const img = await screen.findByAltText(/luke/i);
    expect(img).toHaveAttribute("src", dataUri);

    // Raw fields (actual UI output)
    expect(await screen.findByText("/planets/1/")).toBeVisible();
    expect(await screen.findByText("/films/1/")).toBeVisible();
  });

  it("shows an error state when fetch fails", async () => {
    vi.doMock("../../api/swapi", () => ({
      fetchByUrl: vi.fn(async () => {
        throw new Error("network failure");
      }),
      fetchMultipleByUrls: vi.fn(async () => []),
    }));

    vi.doMock("../../utils/imageProvider", () => ({
      getSafeImageForItem: vi.fn().mockResolvedValue(null),
    }));

    const mod = await import("./DetailView");
    const DetailView = (mod as any).DetailView ?? (mod as any).default;

    render(<DetailView resource="people" url="/people/404/" />);

    expect(await screen.findByText(/error: network failure/i)).toBeVisible();
  });
});
