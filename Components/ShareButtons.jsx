import React from 'react';
import { TwitterShareButton, FacebookShareButton } from 'react-share';
import { TwitterIcon, FacebookIcon } from 'react-share';

const ShareButtons = ({ url, title }) => (
  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
    <TwitterShareButton url={url} title={title}>
      <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', backgroundColor: '#1DA1F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        <TwitterIcon size={24} round={true} /> Share on Twitter
      </button>
    </TwitterShareButton>
    <FacebookShareButton url={url} quote={title}>
      <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px', backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        <FacebookIcon size={24} round={true} /> Share on Facebook
      </button>
    </FacebookShareButton>
  </div>
);

export default ShareButtons;