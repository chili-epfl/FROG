import * as React from 'react';
import { HTML } from 'frog-utils';

export const Annotation = ({
  username,
  date,
  text,
  quotation,
  article,
  articleSite,
  articleLink,
  timestampLink
}) => (
  <div className="ng-scope ng-isolate-scope annotation annotation--reply is-highlighted">
    <div className="ng-scope">
      <annotation-header className="ng-isolate-scope">
        <header className="annotation-header">
          <span className="ng-scope">
            <a
              className="annotation-header__user ng-binding ng-scope"
              target="_blank"
              rel="noopener noreferrer"
              href={`acct:https://hypothes.is/u/${username}@hypothes.is`}
            >
              {username}{' '}
            </a>
            <br />
            <span className="annotation-header__share-info">
              <i className="h-icon-group" />
              <span className="annotation-header__group-name ng-binding">
                Public
              </span>
            </span>
          </span>
          {article && (
            <span className="ng-scope">
              <span className="annotation-citation ng-scope">
                on "
                <a className="ng-binding" href={articleLink}>
                  {article}
                </a>
                "
              </span>
              <span className="annotation-citation-domain ng-binding ng-scope">
                {' '}
                ({articleSite})
              </span>
            </span>
          )}
          <span className="u-flex-spacer" />
          <div>
            <a
              className="annotation-header__timestamp"
              target="_blank"
              rel="noopener noreferrer"
              title="Wednesday, 07 Jun 2017, 03:35"
              href={timestampLink}
            >
              {date}
            </a>
          </div>
        </header>
        {quotation && (
          <section className="annotation-quote-list ng-scope">
            <div className="ng-isolate-scope">
              <div className="excerpt__container ng-scope">
                <div className="excerpt" style={{}}>
                  <div>
                    <blockquote
                      className="annotation-quote ng-binding ng-scope"
                      h-branding="selectionFontFamily"
                    >
                      <HTML html={quotation} />
                    </blockquote>
                  </div>
                  <div
                    title="Show the full excerpt"
                    className="excerpt__shadow excerpt__shadow--transparent is-hidden"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </annotation-header>
      <section name="text" className="annotation-body">
        <div className="ng-isolate-scope">
          <div className="excerpt__container ng-scope">
            <div className="excerpt">
              <div className="ng-scope ng-isolate-scope">
                <div className="markdown-body js-markdown-preview has-content">
                  <p>
                    <HTML html={text} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const Hypothesis = ({ children }) => (
  <div className="content" style={{ textAlign: 'left' }}>
    <main className="ng-scope">
      <annotation-viewer-content className="ng-scope ng-isolate-scope">
        <thread-list className="ng-isolate-scope">
          <ul className="thread-list">
            <li className="thread-list__spacer" />

            <li className="ng-scope">
              <div className="thread-list__card">
                <annotation-thread className="ng-isolate-scope">
                  <div className="annotation-thread">
                    <div className="annotation-thread__content">{children}</div>
                  </div>
                </annotation-thread>
              </div>
            </li>
            <li className="thread-list__spacer" style={{ height: 0 }} />
          </ul>
        </thread-list>
      </annotation-viewer-content>
    </main>
  </div>
);

export const Indented = ({ children }) => (
  <ul ng-show="!vm.thread.collapsed">
    <li className="ng-scope">
      <annotation-thread className="ng-isolate-scope">
        <div className="annotation-thread annotation-thread--reply annotation-thread--top-reply">
          <div className="annotation-thread__content">
            <ul>
              <li className="ng-scope">
                <annotation-thread className="ng-isolate-scope">
                  <div className="annotation-thread annotation-thread--reply">
                    <div className="annotation-thread__thread-edge ng-scope">
                      <a
                        title="Collapse"
                        className="annotation-thread__collapse-toggle is-open"
                      >
                        <span className="h-icon-arrow-drop-down" />
                      </a>
                      <div className="annotation-thread__thread-line" />
                    </div>
                    <div className="annotation-thread__content">{children}</div>
                  </div>
                </annotation-thread>
              </li>
            </ul>
          </div>
        </div>
      </annotation-thread>
    </li>
  </ul>
);

export default Annotation;
