import { describe, it, expect } from "vitest";
import { render, screen } from "../utils";
import Layout from "../../src/components/Layout";

describe("Layout", () => {
  it("renders header with app title", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText("Notes App")).toBeInTheDocument();
    expect(
      screen.getByText("Your personal note-taking companion")
    ).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <Layout>
        <div>First Child</div>
        <div>Second Child</div>
      </Layout>
    );

    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
  });
});
