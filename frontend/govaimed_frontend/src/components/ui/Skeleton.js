import React from 'react';
import '../../Styles/Skeleton.css';

export const SkeletonLine = ({ width = '100%', height = 14 }) => (
  <div className="skeleton skeleton-line" style={{ width, height }} aria-hidden="true" />
);

export const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton skeleton-circle" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-line" style={{ width: '60%' }} />
      <div className="skeleton skeleton-line" style={{ width: '40%', marginTop: 8 }} />
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="skeleton-list">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonLine;
