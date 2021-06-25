import React from 'react';

import Text from '../Text';

export type MiniTableColor = 'default' | 'success' | 'danger' | 'warning';

export type MiniTableRow = {
  /**
   * Unique key of this row
   */
  key: string;
  /**
   * Title of this row
   */
  title: string;
  /**
   * Value of this row
   */
  value: string | number;
};

type MiniTableProps = {
  /**
   * Array of rows to be displayed
   */
  rows: MiniTableRow[];
  /**
   * Color of the component
   * @default 'default'
   */
  color?: MiniTableColor;
  /**
   * Aditional CSS inline style
   */
  style?: React.CSSProperties;
};

/**
 * A mini table that displays rows of data
 */
function MiniTable({ rows, color = 'default', style }: MiniTableProps) {
  return (
    <ul className="pm-c-mini-table" style={style}>
      {rows?.map(item => (
        <li key={item.key} className={`pm-c-mini-table__item--${color}`}>
          <Text as="span" scale="tiny-uppercase" fontWeight="bold">
            {item.title}
          </Text>
          <div className="fill-empty-space" />
          <Text as="strong" scale="caption" fontWeight="bold">
            {item.value}
          </Text>
        </li>
      ))}
    </ul>
  );
}

export default MiniTable;
