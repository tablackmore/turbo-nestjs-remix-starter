import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { CreateItemAttributesDto, ItemDto, UpdateItemAttributesDto } from './dto/item.dto';

interface Item {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ItemsService {
  private items: Item[] = [
    {
      id: '1',
      name: 'Sample Item 1',
      description: 'This is a sample item for demonstration',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z'),
    },
    {
      id: '2',
      name: 'Sample Item 2',
      description: 'Another sample item for testing',
      createdAt: new Date('2024-01-16T14:20:00Z'),
      updatedAt: new Date('2024-01-16T14:20:00Z'),
    },
    {
      id: '3',
      name: 'Sample Item 3',
      description: 'Third sample item in our collection',
      createdAt: new Date('2024-01-17T09:15:00Z'),
      updatedAt: new Date('2024-01-17T09:15:00Z'),
    },
  ];

  private nextId = 4;

  findAll(query: PaginationQueryDto): { items: ItemDto[]; total: number } {
    const filteredItems = [...this.items];

    // Apply sorting
    if (query.sort) {
      filteredItems.sort((a, b) => {
        const aValue = a[query.sort as keyof Item];
        const bValue = b[query.sort as keyof Item];

        if (aValue < bValue) return query.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return query.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const total = filteredItems.length;
    const page = query.page || 1;
    const limit = query.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems.map((item) => this.toDto(item)),
      total,
    };
  }

  findOne(id: string): ItemDto {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return this.toDto(item);
  }

  create(createItemData: CreateItemAttributesDto): ItemDto {
    const newItem: Item = {
      id: String(this.nextId++),
      name: createItemData.name,
      description: createItemData.description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(newItem);
    return this.toDto(newItem);
  }

  createSimple(name: string, description: string): ItemDto {
    const newItem: Item = {
      id: String(this.nextId++),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.items.push(newItem);
    return this.toDto(newItem);
  }

  update(id: string, updateItemData: UpdateItemAttributesDto): ItemDto {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    const item = this.items[itemIndex];
    const updatedItem: Item = {
      ...item,
      ...(updateItemData.name && { name: updateItemData.name }),
      ...(updateItemData.description !== undefined && { description: updateItemData.description }),
      updatedAt: new Date(),
    };

    this.items[itemIndex] = updatedItem;
    return this.toDto(updatedItem);
  }

  updateSimple(id: string, name?: string, description?: string): ItemDto {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    const item = this.items[itemIndex];
    const updatedItem: Item = {
      ...item,
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      updatedAt: new Date(),
    };

    this.items[itemIndex] = updatedItem;
    return this.toDto(updatedItem);
  }

  remove(id: string): void {
    const itemIndex = this.items.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    this.items.splice(itemIndex, 1);
  }

  private toDto(item: Item): ItemDto {
    return {
      id: item.id,
      type: 'item',
      attributes: {
        name: item.name,
        description: item.description,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      },
    };
  }
}
