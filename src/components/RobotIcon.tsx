import React from 'react';

type RobotIconProps = {
  className?: string;
};

export function RobotIcon({ className = "" }: RobotIconProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#0066cc" d="M500 100C276.142 100 94.8571 281.285 94.8571 505.143C94.8571 728.999 276.142 910.285 500 910.285C723.856 910.285 905.143 728.999 905.143 505.143C905.143 281.285 723.856 100 500 100ZM500 862.857C302.571 862.857 142.285 702.571 142.285 505.143C142.285 307.714 302.571 147.428 500 147.428C697.427 147.428 857.713 307.714 857.713 505.143C857.713 702.571 697.427 862.857 500 862.857Z" />
      <circle fill="#0066cc" cx="350" cy="450" r="50" />
      <circle fill="#0066cc" cx="650" cy="450" r="50" />
      <path stroke="#0066cc" d="M350 650C350 650 425 700 500 700C575 700 650 650 650 650" strokeWidth="40" fill="none" strokeLinecap="round" />
    </svg>
  );
}