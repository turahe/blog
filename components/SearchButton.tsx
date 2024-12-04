import {InstantSearch} from 'react-instantsearch';
import {instantMeiliSearch} from '@meilisearch/instant-meilisearch';

const SearchButton = () => {
    const {searchClient} = instantMeiliSearch(
        'https://ms-adf78ae33284-106.lon.meilisearch.io',
        'a63da4928426f12639e19d62886f621130f3fa9ff3c7534c5d179f0f51c4f303'
    );

    return (
        <InstantSearch
            indexName="steam-videogames"
            searchClient={searchClient}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="text-gray-900 dark:text-gray-100 h-6 w-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
            </svg>
        </InstantSearch>
    )
}


export default SearchButton
