import React from 'react';
import { getStatusColor } from '../utils/helpers';

export default function Badge({ status, children }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {children || status}
    </span>
  );
}
