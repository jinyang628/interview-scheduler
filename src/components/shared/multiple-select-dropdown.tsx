import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
      <DropdownMenuTrigger className="text-base">
        {selectedItems.map((item) => item[0]).join(' ') || name}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" side="bottom" align="center">
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
