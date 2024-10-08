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
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}

export const handleSearchChange = (e, setSearchText, allPosts, userPosts, searchTimeout, setSearchTimeout, setSearchedResults, setUserSearchedResults) => {
    const value = e.target.value;
    setSearchText(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  
    const timeout = setTimeout(() => {
      const searchResults = allPosts.filter(
        (item) =>
          item.username.toLowerCase().includes(value.toLowerCase()) ||
          item.prompt.toLowerCase().includes(value.toLowerCase())
      );
      setSearchedResults(searchResults);

      const userSearchResults = userPosts.filter(
        (item) =>
          item.username.toLowerCase().includes(value.toLowerCase()) ||
          item.prompt.toLowerCase().includes(value.toLowerCase())
      );
      setUserSearchedResults(userSearchResults);

    }, 500);

    setSearchTimeout(timeout);
  };
  