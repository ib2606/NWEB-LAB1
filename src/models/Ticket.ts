import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Ticket extends Model {
    public id!: string;
    public vatin!: string;
    public firstName!: string;
    public lastName!: string;
    public createdAt!: Date;
}

Ticket.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        vatin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'tickets',
        timestamps: true,
    }
);

export default Ticket;
