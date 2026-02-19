import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { SalesTransactionItemAttributes } from "@/entities/transactionItem.entity";

export type SalesTransactionItemCreationAttributes = Optional<SalesTransactionItemAttributes, "uuid" | "discount_amount" | "created_at" | "updated_at" | "deleted_at">;

class SalesTransactionItemModel extends Model<SalesTransactionItemAttributes, SalesTransactionItemCreationAttributes> implements SalesTransactionItemAttributes {
    declare uuid: string;
    declare sale_uuid: string;
    declare product_uuid: string;
    declare quantity: number;
    declare unit_price: number;
    declare discount_amount: number;
    declare subtotal: number;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;

    static associate(models: AllModels): void {
        SalesTransactionItemModel.belongsTo(models.SalesTransaction, {
            foreignKey: "sale_uuid",
            as: "transaction",
        });
        SalesTransactionItemModel.belongsTo(models.Product, {
            foreignKey: "product_uuid",
            as: "product",
        });
    }
}

SalesTransactionItemModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        sale_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        product_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0,
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "SalesTransactionItem",
        tableName: "sales_transaction_items",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default SalesTransactionItemModel;
