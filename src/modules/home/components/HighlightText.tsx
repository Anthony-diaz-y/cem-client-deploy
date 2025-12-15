import React from 'react'

interface HighlightTextProps {
  text: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text }) => {
  return (
    <span className='font-bold text-richblue-200 gradient_color'>
      {" "}
      {text}
    </span>
  )
}

export default HighlightText
