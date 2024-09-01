import React from 'react';
import FormField from './FormField';

const SearchBar = ({ searchText, handleSearchChange }) => {
  return (
    <div className="mt-16">
      <FormField
        LabelName="Search posts"
        type="text"
        name="text"
        placeholder="Search posts"
        value={searchText}
        handleChange={handleSearchChange}
      />
    </div>
  );
};

export default SearchBar;
