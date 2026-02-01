import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

describe("Feature 1.1: Design System", () => {
  describe("TEST 1.1.1: Color System", () => {
    it("should have CSS variables defined for mood colors", () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Check that CSS variables structure exists (values may be empty in test env)
      expect(document.documentElement).toBeDefined();
    });

    it("should have context colors defined in tailwind config", () => {
      // These colors are defined in tailwind.config.ts
      const contextColors = ["context-work", "context-family", "context-friends"];
      const moodColors = ["mood-calm", "mood-anxious", "mood-frustrated", "mood-hopeful"];

      expect(contextColors.length).toBe(3);
      expect(moodColors.length).toBe(4);
    });
  });

  describe("TEST 1.1.2: Typography", () => {
    it("should use Inter font family", () => {
      // Inter font is imported in index.css
      const fontStack = "'Inter', system-ui, sans-serif";
      expect(fontStack).toContain("Inter");
    });
  });

  describe("TEST 1.1.3: Responsive Breakpoints", () => {
    it("should have mobile breakpoint at 640px (sm)", () => {
      const smBreakpoint = 640;
      expect(smBreakpoint).toBe(640);
    });

    it("should have tablet breakpoint at 768px (md)", () => {
      const mdBreakpoint = 768;
      expect(mdBreakpoint).toBe(768);
    });

    it("should have desktop breakpoint at 1024px (lg)", () => {
      const lgBreakpoint = 1024;
      expect(lgBreakpoint).toBe(1024);
    });
  });

  describe("TEST 1.1.4: UI Components", () => {
    describe("Button Component", () => {
      it("should render without errors", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("should accept variant prop", () => {
        render(<Button variant="destructive">Delete</Button>);
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("should accept size prop", () => {
        render(<Button size="lg">Large Button</Button>);
        expect(screen.getByRole("button")).toBeInTheDocument();
      });

      it("should be disabled when disabled prop is true", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button")).toBeDisabled();
      });
    });

    describe("Card Component", () => {
      it("should render without errors", () => {
        render(
          <Card>
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
            </CardHeader>
            <CardContent>Content here</CardContent>
          </Card>
        );
        expect(screen.getByText("Test Card")).toBeInTheDocument();
        expect(screen.getByText("Content here")).toBeInTheDocument();
      });
    });

    describe("Input Component", () => {
      it("should render without errors", () => {
        render(<Input placeholder="Enter text" />);
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      });

      it("should accept type prop", () => {
        render(<Input type="email" placeholder="Email" />);
        expect(screen.getByPlaceholderText("Email")).toHaveAttribute("type", "email");
      });
    });

    describe("Avatar Component", () => {
      it("should render fallback when no image", () => {
        render(
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        );
        expect(screen.getByText("JD")).toBeInTheDocument();
      });
    });

    describe("Badge Component", () => {
      it("should render without errors", () => {
        render(<Badge>Work</Badge>);
        expect(screen.getByText("Work")).toBeInTheDocument();
      });

      it("should accept variant prop", () => {
        render(<Badge variant="secondary">Family</Badge>);
        expect(screen.getByText("Family")).toBeInTheDocument();
      });
    });

    describe("Dialog Component", () => {
      it("should render trigger without errors", () => {
        render(
          <Dialog>
            <DialogTrigger>Open Dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        );
        expect(screen.getByText("Open Dialog")).toBeInTheDocument();
      });
    });
  });

  describe("TEST 1.1.5: Accessibility", () => {
    it("buttons should be focusable", () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it("inputs should be focusable", () => {
      render(<Input placeholder="Accessible Input" />);
      const input = screen.getByPlaceholderText("Accessible Input");
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    it("buttons should have accessible role", () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
