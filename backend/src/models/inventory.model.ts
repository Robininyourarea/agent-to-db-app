import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { InventoryAttributes } from "@/entities/inventory.entity";

export type InventoryCreationAttributes = Optional<InventoryAttributes, "uuid" | "warehouse_name" | "created_at" | "updated_at" | "deleted_at">;

class InventoryModel extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    declare uuid: string;
    declare product_uuid: string;
    declare warehouse_name: string;
    declare quantity: number;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date | null;

    static associate(models: AllModels): void {
        InventoryModel.belongsTo(models.Product, {
            foreignKey: "product_uuid",
            as: "product",
        });
    }
}

InventoryModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        product_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        warehouse_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Inventory",
        tableName: "inventory",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default InventoryModel;
