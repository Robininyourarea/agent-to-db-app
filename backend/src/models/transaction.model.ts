import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { PaymentMethodEnum, PaymentStatusEnum, TransactionStatusEnum } from "@/enum/transaction.enum";
import { SalesTransactionAttributes } from "@/entities/transaction.entity";

export type SalesTransactionCreationAttributes = Optional<SalesTransactionAttributes, "uuid" | "sale_date" | "customer_uuid" | "tax_amount" | "discount_amount" | "payment_method" | "payment_status" | "due_date" | "status" | "created_at" | "updated_at" | "deleted_at">;

class SalesTransactionModel extends Model<SalesTransactionAttributes, SalesTransactionCreationAttributes> implements SalesTransactionAttributes {
    declare uuid: string;
    declare sale_date: Date;
    declare customer_uuid: string;
    declare employee_uuid: string;
    declare subtotal: number;
    declare tax_amount: number;
    declare discount_amount: number;
    declare total_amount: number;
    declare payment_method: PaymentMethodEnum;
    declare payment_status: PaymentStatusEnum;
    declare due_date: Date;
    declare status: TransactionStatusEnum;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date | null;

    static associate(models: AllModels): void {
        SalesTransactionModel.belongsTo(models.Customer, {
            foreignKey: "customer_uuid",
            as: "customer",
        });
        SalesTransactionModel.belongsTo(models.Employee, {
            foreignKey: "employee_uuid",
            as: "employee",
        });
        SalesTransactionModel.hasMany(models.SalesTransactionItem, {
            foreignKey: "sale_uuid",
            as: "items",
        });
    }
}

SalesTransactionModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        sale_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        customer_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        employee_uuid: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        tax_amount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false,
        },
        discount_amount: {
            type: DataTypes.DECIMAL(12, 2),
            defaultValue: 0,
            allowNull: false,
        },
        total_amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        payment_method: {
            type: DataTypes.ENUM(...Object.values(PaymentMethodEnum)),
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.ENUM(...Object.values(PaymentStatusEnum)),
            defaultValue: PaymentStatusEnum.PAID,
            allowNull: false,
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(...Object.values(TransactionStatusEnum)),
            defaultValue: TransactionStatusEnum.COMPLETED,
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
        modelName: "SalesTransaction",
        tableName: "sales_transactions",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default SalesTransactionModel;
