import React from 'react';

export default function Timeline({ items }) {
  if (!items || items.length === 0) return <p className="text-neutral-500 text-sm">No updates available.</p>;

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {items.map((item, itemIdx) => (
          <li key={item.id || itemIdx}>
            <div className="relative pb-8">
              {itemIdx !== items.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-neutral-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${item.iconBg || 'bg-neutral-100'}`}>
                    {item.icon ? (
                      <item.icon className={`h-4 w-4 ${item.iconColor || 'text-neutral-500'}`} aria-hidden="true" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
                    )}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-neutral-500">
                      {item.content}{' '}
                      <span className="font-medium text-neutral-900">{item.target}</span>
                    </p>
                    {item.description && (
                      <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-neutral-500">
                    <time dateTime={item.date}>{item.dateLabel}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
