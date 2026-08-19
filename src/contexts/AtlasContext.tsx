import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type RailMode = 'top' | 'content' | 'project';

export interface SectionMeta {
  id: string;
  index: string;
  label: string;
}

export interface ProjectMeta {
  slug: string;
  index: string;
  title: string;
}

interface AtlasValue {
  /** sections registered by the current page, in document order */
  sections: SectionMeta[];
  registerSections: (sections: SectionMeta[]) => void;
  activeSection: string | null;
  setActiveSection: (id: string | null) => void;
  /** header state machine */
  mode: RailMode;
  setMode: (mode: RailMode) => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  /** case-study context, null on the home route */
  project: ProjectMeta | null;
  setProject: (project: ProjectMeta | null) => void;
  chapter: string | null;
  setChapter: (chapter: string | null) => void;
}

const AtlasContext = createContext<AtlasValue | null>(null);

export function AtlasProvider({ children }: {children: React.ReactNode;}) {
  const [sections, setSections] = useState<SectionMeta[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mode, setMode] = useState<RailMode>('top');
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState<ProjectMeta | null>(null);
  const [chapter, setChapter] = useState<string | null>(null);

  const registerSections = useCallback((next: SectionMeta[]) => {
    setSections((prev) => {
      if (
      prev.length === next.length &&
      prev.every((s, i) => s.id === next[i].id && s.label === next[i].label))

      return prev;
      return next;
    });
  }, []);

  const value = useMemo<AtlasValue>(
    () => ({
      sections,
      registerSections,
      activeSection,
      setActiveSection,
      mode,
      setMode,
      menuOpen,
      setMenuOpen,
      project,
      setProject,
      chapter,
      setChapter
    }),
    [sections, registerSections, activeSection, mode, menuOpen, project, chapter]
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used inside AtlasProvider');
  return ctx;
}