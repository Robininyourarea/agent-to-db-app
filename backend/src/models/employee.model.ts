import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/db/sequelize";
import { v7 as uuidv7 } from "uuid";
import AllModels from "@/models/allModels";
import { EmployeePositionEnum } from "@/enum/employee.enum";
import { EmployeeAttributes } from "@/entities/employee.entity";

export type EmployeeCreationAttributes = Optional<EmployeeAttributes, "uuid" | "position" | "phone" | "email" | "hire_date" | "is_active" | "created_at" | "updated_at" | "deleted_at">;

class EmployeeModel extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
    declare uuid: string;
    declare employee_code: string;
    declare first_name: string;
    declare last_name: string;
    declare position: EmployeePositionEnum;
    declare phone: string;
    declare email: string;
    declare hire_date: Date;
    declare is_active: boolean;
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date | null;

    static associate(models: AllModels): void {
        EmployeeModel.hasMany(models.SalesTransaction, {
            foreignKey: "employee_uuid",
            as: "sales",
        });
    }
}

EmployeeModel.init(
    {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: () => uuidv7(),
        },
        employee_code: {
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
        position: {
            type: DataTypes.ENUM(...Object.values(EmployeePositionEnum)),
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
        hire_date: {
            type: DataTypes.DATEONLY,
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
        modelName: "Employee",
        tableName: "employees",
        timestamps: true,
        paranoid: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

export default EmployeeModel;
