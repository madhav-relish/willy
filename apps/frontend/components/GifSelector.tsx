import React, { useContext, useState } from 'react';
import axios from 'axios';
import { GiphyFetch } from '@giphy/js-fetch-api'

import {
    Grid, // our UI Component to display the results
    SearchBar, // the search bar the user will type into
    SearchContext, // the context that wraps and connects our components
    SearchContextManager, // the context manager, includes the Context.Provider
    SuggestionBar, // an optional UI component that displays trending searches and channel / username results
} from '@giphy/react-components'


const GifSelector = ({ onSelect }: { onSelect: (url: string) => void }) => {

  return (
    <div className='h-96 w-full overflow'>
        <SearchContextManager apiKey={process.env.NEXT_PUBLIC_GIPHY_API_KEY || ""}>
        <Components onSelect={onSelect}/>
    </SearchContextManager>
    </div>
  );
};

export default GifSelector;

const Components = ({ onSelect }: { onSelect: (url: string) => void }) => {
    const { fetchGifs, searchKey } = useContext(SearchContext)
    return (
        <div className='flex flex-col gap-2'>
            <SearchBar />
            <SuggestionBar />
            {/**
                key will recreate the component,
                this is important for when you change fetchGifs
                e.g. changing from search term dogs to cats or type gifs to stickers
                you want to restart the gifs from the beginning and changing a component's key does that
            **/}
            <div className='h-76 overflow-auto'>

            <Grid onGifClick={(gif,e)=>{
                e.preventDefault()
                onSelect(String(gif.images.original.url))
                } }
                 key={searchKey}  columns={2} width={340} className='h-72 '  fetchGifs={fetchGifs} />
            </div>
        </div>
    )
}
