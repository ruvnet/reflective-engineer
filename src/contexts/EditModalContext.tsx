import React, { createContext, useContext, useState } from 'react';
import { SavedTemplate, SavedTool, SavedPrompt } from '../services/storageService';

interface EditModalContextType {
  editingTool: SavedTool | null;
  setEditingTool: (tool: SavedTool | null) => void;
  editingTemplate: SavedTemplate | null;
  setEditingTemplate: (template: SavedTemplate | null) => void;
  editingPrompt: SavedPrompt | null;
  setEditingPrompt: (prompt: SavedPrompt | null) => void;
  isToolBuilderOpen: boolean;
  setIsToolBuilderOpen: (open: boolean) => void;
  isTemplateEditorOpen: boolean;
  setIsTemplateEditorOpen: (open: boolean) => void;
  isGenerateOpen: boolean;
  setIsGenerateOpen: (open: boolean) => void;
  resetState: () => void;
}

const EditModalContext = createContext<EditModalContextType | undefined>(undefined);

export function EditModalProvider({ children }: { children: React.ReactNode }) {
  const [editingTool, setEditingTool] = useState<SavedTool | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<SavedTemplate | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  const [isToolBuilderOpen, setIsToolBuilderOpen] = useState(false);
  const [isTemplateEditorOpen, setIsTemplateEditorOpen] = useState(false);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const resetState = () => {
    setEditingTool(null);
    setEditingTemplate(null);
    setEditingPrompt(null);
    setIsToolBuilderOpen(false);
    setIsTemplateEditorOpen(false);
    setIsGenerateOpen(false);
  };

  return (
    <EditModalContext.Provider
      value={{
        editingTool,
        setEditingTool,
        editingTemplate,
        setEditingTemplate,
        editingPrompt,
        setEditingPrompt,
        isToolBuilderOpen,
        setIsToolBuilderOpen,
        isTemplateEditorOpen,
        setIsTemplateEditorOpen,
        isGenerateOpen,
        setIsGenerateOpen,
        resetState,
      }}
    >
      {children}
    </EditModalContext.Provider>
  );
}

export function useEditModal() {
  const context = useContext(EditModalContext);
  if (context === undefined) {
    throw new Error('useEditModal must be used within an EditModalProvider');
  }
  return context;
}
