"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxOption {
    value: string;
    label: string;
}

interface CreatableComboboxProps {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyPlaceholder?: string;
    createPlaceholder?: (value: string) => string;
}

export function CreatableCombobox({
    options,
    value,
    onChange,
    placeholder = "Select option...",
    searchPlaceholder = "Search...",
    emptyPlaceholder = "No options found.",
    createPlaceholder = (val) => `Create "${val}"`,
}: CreatableComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")

    const found = options.find((option) => option.label.toLowerCase() === inputValue.toLowerCase());

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? options.find((option) => option.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput 
                        placeholder={searchPlaceholder}
                        value={inputValue}
                        onValueChange={setInputValue}
                    />
                    <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
                    <CommandGroup>
                        {!found && inputValue && (
                             <CommandItem
                                onSelect={() => {
                                    onChange(inputValue)
                                    setOpen(false)
                                }}
                             >
                                 {createPlaceholder(inputValue)}
                             </CommandItem>
                        )}
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={(currentValue) => {
                                    const val = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase())?.value ?? ""
                                    onChange(val === value ? "" : val)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
