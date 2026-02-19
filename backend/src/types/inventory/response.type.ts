export type InventoryResponse = {
    uuid: string;
    product_uuid: string;
    warehouse_name: string;
    quantity: number;
    is_active: boolean;
};

export type InventoryListResponse = {
    rows: InventoryResponse[];
    count: number;
};
