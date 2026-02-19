import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { CustomerTypeEnum } from "@/enum/customer.enum";
import { CustomerAttributes } from "@/entities/customer.entity";

// Define the attributes required for creation (optional ones can be omitted)
export type CustomerCreationAttributes = Optional<CustomerAttributes, "uuid" | "customer_code" | "last_name" | "phone" | "email" | "address" | "city" | "postal_code" | "customer_type" | "is_active" | "created_at" | "updated_at" | "deleted_at">;

class CustomerModel extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    declare uuid: string;
    declare customer_code: string;
    declare first_name: string;
    declare last_name: string;
    declare phone: string;
    declare email: string;
    declare address: string;
    declare city: string;
    declare postal_code: string;
    declare customer_type: CustomerTypeEnum;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date | null;

    static associate(models: AllModels): void {
        CustomerModel.hasMany(models.SalesTransaction, {
            foreignKey: "customer_uuid",
            as: "sales",
        });
    }
}

CustomerModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        customer_code: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        customer_type: {
            type: DataTypes.ENUM(...Object.values(CustomerTypeEnum)),
            defaultValue: CustomerTypeEnum.GENERAL,
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
        modelName: "Customer",
        tableName: "customers",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default CustomerModel;
