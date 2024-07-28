import React from 'react';
import { BiSearchAlt2 } from "react-icons/bi";

const SearchForm = ({ search, setSearch, searchSubmitHandler }) => (
  <form onSubmit={searchSubmitHandler} className='mt-4 flex items-center gap-2'>
    <input value={search} onChange={(e) => setSearch(e.target.value)} type='text' className='flex-1 p-2 rounded-lg bg-gray-900 text-white border border-myclr placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-myclr' placeholder='Search..' />
    <button type='submit' className='p-2 rounded-lg bg-myclr hover:bg-myclr focus:outline-none focus:ring-2 focus:ring-mycl2'><BiSearchAlt2 className='w-6 h-6 outline-none' /></button>
  </form>
);

export default SearchForm;
