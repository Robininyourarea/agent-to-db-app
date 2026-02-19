import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { ProductCategoryEnum } from "@/enum/product.enum";
import { ProductAttributes } from "@/entities/product.entity";

export type ProductCreationAttributes = Optional<ProductAttributes, "uuid" | "category" | "is_active" | "created_at" | "updated_at" | "deleted_at">;

class ProductModel extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    declare uuid: string;
    declare product_code: string;
    declare product_name: string;
    declare category: ProductCategoryEnum;
    declare cost_price: number;
    declare selling_price: number;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date | null;

    static associate(models: AllModels): void {
        ProductModel.hasMany(models.Inventory, {
            foreignKey: "product_uuid",
            as: "inventory",
        });
        ProductModel.hasMany(models.SalesTransactionItem, {
            foreignKey: "product_uuid",
            as: "sales_items",
        });
    }
}

ProductModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        product_code: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM(...Object.values(ProductCategoryEnum)),
            allowNull: false,
        },
        cost_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        selling_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
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
        modelName: "Product",
        tableName: "products",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default ProductModel;
