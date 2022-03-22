import React from 'react';
import DOMPurify from 'dompurify';
import ReactHtmlParser from 'react-html-parser';
import styles from './ThreadTitle.css';

const ThreadTitle = ({
  profileImage,
  owner,
  time,
  subject,
  alias,
  thread_id,
}) => {
  const clean_subject = DOMPurify.sanitize(subject);

  return (
    <>
      <div className='card mb-2'>
        <div className='card-body p-2 p-sm-3'>
          <div className='media forum-item'>
            <div>
              <img
                src={profileImage}
                className='mr-3 rounded-circle'
                width='50'
                alt='User'
              />
            </div>
            <div className='media-body'>
              <a
                href='\#'
                data-toggle='collapse'
                data-target={'.forum-content' + thread_id}
                data-parent={'.forum-content' + thread_id}
                className='text-body'
              >
                <div className={'text-white ' + styles.subject}>
                  {ReactHtmlParser(clean_subject)}
                </div>
              </a>
              <p className='text-muted'>
                <a href='\#' data-toggle='tooltip' title={owner}>
                  {alias}
                </a>{' '}
                posted{' '}
                <span className='text-secondary font-weight-bold'>
                  {' '}
                  {time} ago
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreadTitle;
