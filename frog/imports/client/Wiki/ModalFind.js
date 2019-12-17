// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { SearchField, Highlight } from '/imports/frog-utils';
import { orderBy } from 'lodash';

export const PagesLinks = ({
  pages,
  currentPage,
  search = '',
  index,
  onSelect,
  currentInstance
}: {
  pages: Object[],
  currentPage?: string,
  currentInstance?: string,
  search: string,
  index: ?number,
  onSelect: Function
}): React.Element<*>[] =>
  pages
    .filter(x => !x.title.includes('/'))
    .map((pageObj, i) => {
      const pageId = pageObj.id;
      const pageTitle = pageObj.title;

      const currentPageBool = pageId === currentPage;

      const pageLinkStyle = {
        fontSize: '14px',
        marginTop: '12px',
        backgroundColor:
          i === index
            ? 'cornflowerblue'
            : currentPageBool
            ? '#e6e6e6'
            : undefined,
        color: currentPageBool ? 'blue' : 'auto',
        cursor: currentPageBool ? 'auto' : 'pointer'
      };
      return (
        <li key={pageId} data-testid="wiki_page_item">
          <span
            style={pageLinkStyle}
            onClick={e => {
              const sideToSend = e.shiftKey ? 'right' : 'left';
              onSelect(pageTitle, null, sideToSend);
              e.preventDefault();
            }}
          >
            <Highlight searchStr={search} text={pageTitle} />
          </span>
          {currentPageBool &&
            search.trim().length === 0 &&
              pages.filter(x => x.title.startsWith(pageTitle + '/')).length >
                0 && (
                <ul>
                  {pages
                    .filter(x => x.title.startsWith(pageTitle + '/'))
                    .map(subpage => (
                      <li
                        key={subpage.title}
                        style={{
                          color:
                            subpage.title.split('/')[1] === currentInstance
                              ? 'blue'
                              : '#585858',
                          cursor: 'pointer'
                        }}
                      >
                        <span
                          onClick={e => {
                            onSelect(subpage.title);
                            e.preventDefault();
                          }}
                        >
                          {' - ' + subpage.title.split('/')[1]}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
        </li>
      );
    });

export default ({ onSearch, setModalOpen, pages, onSelect }: Object) => {
  const [search, setSearch] = React.useState('');
  return (
    <Dialog open onClose={() => setModalOpen(false)}>
      <DialogTitle>Find page</DialogTitle>
      <DialogContent>
        <div
          style={{
            width: '600px',
            height: '600px',
            overflow: 'auto',
            paddingRight: '100px'
          }}
        >
          <SearchAndFind
            pages={pages}
            focus
            setSearch={setSearch}
            onSearch={onSearch}
            onSelect={onSelect}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        {search !== '' && (
          <Button color="secondary" onClick={() => onSearch(search)}>
            SEARCH
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export const SearchAndFind = ({
  setSearch: upstreamSetSearch,
  pages,
  onSearch,
  onSelect,
  focus,
  currentPage,
  currentInstance
}: Object) => {
  const [search, setSearch] = React.useState('');
  const [index, setIndex] = React.useState(null);
  const filteredPages = orderBy(pages, 'title').filter(x =>
    x.title.toLowerCase().includes(search)
  );
  return (
    <>
      <SearchField
        prompt="Select page or do a fulltext search"
        debounce={100}
        focus={!!focus}
        onKeyDown={e => {
          if (e.keyCode === 38 && index && index > 0) {
            e.preventDefault();
            setIndex(index - 1);
          }
          if (
            e.keyCode === 40 &&
            (index === null || index < filteredPages.length - 1)
          ) {
            e.preventDefault();
            setIndex((index === null ? -1 : index) + 1);
          }
          if (e.keyCode === 13) {
            e.preventDefault();
            if (index === null || !filteredPages[index]?.title) {
              onSearch(search);
            } else {
              onSelect(filteredPages[index].title);
            }
          }
        }}
        onChange={e => {
          setIndex(null);
          setSearch(e.toLowerCase());
          if (upstreamSetSearch) {
            upstreamSetSearch(e.toLowerCase());
          }
        }}
        onSubmit={() =>
          index === null || !filteredPages[index]?.title
            ? onSearch(search)
            : onSelect(filteredPages[index].title)
        }
      />
      <PagesLinks
        onSelect={onSelect}
        index={index}
        search={search}
        pages={filteredPages}
        currentPage={currentPage}
        currentInstance={currentInstance}
      />
    </>
  );
};
