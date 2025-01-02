import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DropdownWithItemsProps = {
  name: string;
  items: string[];
  selectedItem: string;
  onSelectItem: (item: string) => void;
};

export default function IndividualSelectDropdown({
  name,
  items,
  selectedItem,
  onSelectItem,
}: DropdownWithItemsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-base">{selectedItem || name}</DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="center">
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={() => onSelectItem(item)}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
