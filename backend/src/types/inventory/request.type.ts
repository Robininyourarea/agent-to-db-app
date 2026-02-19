export type InventoryCreateRequestType = {
    product_uuid: string;
    warehouse_name: string;
    quantity: number;
    is_active?: boolean;
};

export type InventoryUpdateRequestType = {
    product_uuid?: string;
    warehouse_name?: string;
    quantity?: number;
    is_active?: boolean;
};
