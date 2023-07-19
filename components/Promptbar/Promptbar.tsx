import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateReducer } from '@/hooks/useCreateReducer';
import { savePrompts } from '@/utils/app/prompts';
import { OpenAIModels, OpenAIModelID } from '@/types/openai';
import { Prompt } from '@/types/prompt';
import HomeContext from '@/pages/api/home/home.context';
import { PromptFolders } from './components/PromptFolders';
import { PromptbarSettings } from './components/PromptbarSettings';
import { Prompts } from './components/Prompts';
import Sidebar from '../Sidebar';
import PromptbarContext from './PromptBar.context';
import { PromptbarInitialState, initialState } from './Promptbar.state';
import { v4 as uuidv4 } from 'uuid';
const Promptbar = () => {
  const { t } = useTranslation('promptbar');
  const {
    state: { prompts, defaultModelId, showPromptbar },
    dispatch: homeDispatch,
    handleCreateFolder,
  } = useContext(HomeContext);
  const promptBarContextValue = useCreateReducer<PromptbarInitialState>({
    initialState,
  });
  const {
    state: { searchTerm, filteredPrompts },
    dispatch: promptDispatch,
  } = promptBarContextValue;
  console.log('What are this', prompts)
  useEffect(()=>{
    handleCreateFolder('Example prompts', 'prompt')
    const examplePrompt1: Prompt = {
      id: uuidv4(),
      name: `Coding Assistant`,
      description: 'Helping you write code in your Linux terminal',
      content: 'I want you to act as a linux terminal. I will type commands and you will reply with what the terminal should show. I want you to only reply with the terminal output inside one unique code block, and nothing else. do not write explanations. do not type commands unless I instruct you to do so. When I need to tell you something in English, I will do so by putting text inside curly brackets {like this}. My first command is pwd',
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      folderId: 'Example prompts',
    };
    const examplePrompt2: Prompt = {
      id: uuidv4(),
      name: `UI/UX assistant`,
      description: 'Helping your write code in your Linux terminal',
      content: 'I want you to act as a UX/UI developer. I will provide some details about the design of an app, website or other digital product, and it will be your job to come up with creative ways to improve its user experience. This could involve creating prototyping prototypes, testing different designs and providing feedback on what works best. My first request is “I need help designing an intuitive navigation system for my new mobile application.',
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      folderId: 'Example prompts',
    };
    const examplePrompt3: Prompt = {
      id: uuidv4(),
      name: `Cyber Security assistant`,
      description: 'Helping your write code in your Linux terminal',
      content: 'I want you to act as a cyber security specialist. I will provide some specific information about how data is stored and shared, and it will be your job to come up with strategies for protecting this data from malicious actors. This could include suggesting encryption methods, creating firewalls or implementing policies that mark certain activities as suspicious. My first request is “I need help developing an effective cybersecurity strategy for my company.',
      model: OpenAIModels[OpenAIModelID.GPT_3_5],
      folderId: 'Example prompts',
    };
    const updatedPrompts = [...prompts, examplePrompt1, examplePrompt2, examplePrompt3];
    homeDispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);
//  }, [defaultModelId, homeDispatch, prompts, handleCreateFolder])
  }, [])
  const handleTogglePromptbar = () => {
    homeDispatch({ field: 'showPromptbar', value: !showPromptbar });
    localStorage.setItem('showPromptbar', JSON.stringify(!showPromptbar));
  };
  const handleCreatePrompt = () => {
    if (defaultModelId) {
      const newPrompt: Prompt = {
        id: uuidv4(),
        name: `Prompt ${prompts.length + 1}`,
        description: '',
        content: '',
        model: OpenAIModels[defaultModelId],
        folderId: null,
      };
      const updatedPrompts = [...prompts, newPrompt];
      homeDispatch({ field: 'prompts', value: updatedPrompts });
      savePrompts(updatedPrompts);
    }
  };
  const handleDeletePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts.filter((p) => p.id !== prompt.id);
    homeDispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);
  };
  const handleUpdatePrompt = (prompt: Prompt) => {
    const updatedPrompts = prompts.map((p) => {
      if (p.id === prompt.id) {
        return prompt;
      }
      return p;
    });
    homeDispatch({ field: 'prompts', value: updatedPrompts });
    savePrompts(updatedPrompts);
  };
  const handleDrop = (e: any) => {
    if (e.dataTransfer) {
      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));
      const updatedPrompt = {
        ...prompt,
        folderId: e.target.dataset.folderId,
      };
      handleUpdatePrompt(updatedPrompt);
      e.target.style.background = 'none';
    }
  };
  useEffect(() => {
    if (searchTerm) {
      promptDispatch({
        field: 'filteredPrompts',
        value: prompts.filter((prompt) => {
          const searchable =
            prompt.name.toLowerCase() +
            ' ' +
            prompt.description.toLowerCase() +
            ' ' +
            prompt.content.toLowerCase();
          return searchable.includes(searchTerm.toLowerCase());
        }),
      });
    } else {
      promptDispatch({ field: 'filteredPrompts', value: prompts });
    }
  }, [searchTerm, prompts, promptDispatch]);
  return (
    <PromptbarContext.Provider
      value={{
        ...promptBarContextValue,
        handleCreatePrompt,
        handleDeletePrompt,
        handleUpdatePrompt,
      }}
    >
      <Sidebar<Prompt>
        side={'right'}
        isOpen={showPromptbar}
        addItemButtonTitle={t('New prompt')}
        itemComponent={
          <Prompts
            prompts={filteredPrompts.filter((prompt) => !prompt.folderId)}
          />
        }
        folderComponent={<PromptFolders />}
        items={filteredPrompts}
        searchTerm={searchTerm}
        handleSearchTerm={(searchTerm: string) =>
          promptDispatch({ field: 'searchTerm', value: searchTerm })
        }
        toggleOpen={handleTogglePromptbar}
        handleCreateItem={handleCreatePrompt}
        handleCreateFolder={() => handleCreateFolder(t('New folder'), 'prompt')}
        handleDrop={handleDrop}
      />
    </PromptbarContext.Provider>
  );
};
export default Promptbar;