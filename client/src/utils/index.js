import { surpriseMePrompts } from '../constants'
import FileSaver from 'file-saver';

{/*Reuse functions */}

export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() *
    surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];

    if(randomPrompt === prompt) return getRandomPrompt(prompt);

    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`); // Use backticks for template literals
}

// utils.js
export const handleSearchChange = (e, setSearchText, allPosts, searchTimeout, setSearchTimeout, setSearchedResults) => {
    const value = e.target.value;
    setSearchText(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  
    // Set a new timeout
    const timeout = setTimeout(() => {
      const searchResults = allPosts.filter(
        (item) =>
          item.username.toLowerCase().includes(value.toLowerCase()) ||
          item.prompt.toLowerCase().includes(value.toLowerCase())
      );
      setSearchedResults(searchResults);
    }, 500);
  
    setSearchTimeout(timeout);
  };
  