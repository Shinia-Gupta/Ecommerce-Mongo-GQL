"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

function Search() {
    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const toggleSearchBar = () => {
        setSearchBarVisible((prev) => !prev);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/search/${searchTerm}`);
        }
    };

    return (
        <div className="flex items-center flex-col w-full">
            {/* Mobile View */}
            <div className="md:hidden w-full flex justify-end">
                <button 
                    type="button" 
                    onClick={toggleSearchBar} 
                    aria-controls="navbar-search" 
                    aria-expanded={searchBarVisible} 
                    className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 mr-1"
                >
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
            </div>
            {searchBarVisible && (
                <div className="flex gap-2 w-full md:hidden">
                    <input 
                        type="text" 
                        id="search-navbar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Search..." 
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            )}
            
            {/* Desktop View */}
            <div className="relative hidden md:flex w-full justify-center items-center">
                <div className="flex gap-2 w-full md:max-w-lg">
                    <input 
                        type="text" 
                        id="search-navbar" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Search..." 
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </div>
        </div>
    );
}

export default Search;
