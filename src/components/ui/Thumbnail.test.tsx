import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";

function mockImageLoad() {
  const original = Object.getOwnPropertyDescriptor(
    HTMLImageElement.prototype,
    "src"
  );

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    set(value) {
      setTimeout(() => {
        if (this.onload) this.onload(new Event("load"));
      }, 0);
    },
  });

  return () => {
    if (original)
      Object.defineProperty(HTMLImageElement.prototype, "src", original);
  };
}

describe("Thumbnail component", () => {
  let restoreImg: () => void;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    restoreImg = mockImageLoad();
  });

  afterEach(() => {
    if (restoreImg) restoreImg();
  });

  it("renders image when getSafeImageForItem returns a URL (data-URI used to avoid network onload errors)", async () => {
    const dataUri =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    vi.doMock("../../utils/imageProvider", () => ({
      getSafeImageForItem: vi.fn().mockResolvedValue(dataUri),
    }));

    const mod = await import("./Thumbnail");
    const Thumbnail = (mod as any).Thumbnail ?? (mod as any).default;

    render(<Thumbnail resource="people" item={{ name: "Luke", url: "/1" }} />);

    const img = await screen.findByRole(
      "img",
      { name: /luke/i },
      { timeout: 2000 }
    );
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", dataUri);
  });

  it("renders fallback when getSafeImageForItem returns null", async () => {
    vi.doMock("../../utils/imageProvider", () => ({
      getSafeImageForItem: vi.fn().mockResolvedValue(null),
    }));

    const mod = await import("./Thumbnail");
    const Thumbnail = (mod as any).Thumbnail ?? (mod as any).default;

    render(<Thumbnail resource="people" item={{ name: "Yoda", url: "/2" }} />);

    expect(await screen.findByText(/yoda/i)).toBeVisible();
  });
});
