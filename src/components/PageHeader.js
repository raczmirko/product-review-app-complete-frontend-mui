import React from 'react';

const PageHeader = ({ text, color, textColor }) => {
  const headerStyle = {
    backgroundColor: color,
    color: textColor,
    textTransform: 'uppercase',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    fontSize: '28px'
  };

  return (
    <div className="page-header" style={headerStyle}>
      {text}
    </div>
  );
};

export default PageHeader;
