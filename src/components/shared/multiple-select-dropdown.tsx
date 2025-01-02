'use client';

import * as React from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MutlipleSelectDropdownProps = {
  name: string;
  items: string[];
  selectedItems: string[];
  onSelectItems: (items: string[]) => void;
  order: string[];
};

export default function MutlipleSelectDropdown({
  name,
  items,
  selectedItems,
  onSelectItems,
  order,
}: MutlipleSelectDropdownProps) {
  console.log(selectedItems);
  const handleToggle = (item: string) => {
    onSelectItems(
      selectedItems.includes(item)
        ? selectedItems.filter((i) => i !== item)
        : order.filter((i) => [...selectedItems, item].includes(i)),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{name || selectedItems.join(' ')[0]}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuCheckboxItem
            key={item}
            checked={selectedItems.includes(item)}
            onCheckedChange={() => handleToggle(item)}
          >
            {item}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
