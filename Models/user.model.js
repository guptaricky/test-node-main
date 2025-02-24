const { DataTypes } = require("sequelize");
const sequelize = require('../config/dbConnection');


    const Users = sequelize.define(
        "users",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING, // Corrected to STRING
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true, // Added unique constraint for emails
            },
            email_verified_at: {
                type: DataTypes.DATE, // Corrected to DATE type
                allowNull: true,      // This might be nullable
            },
            password: {
                type: DataTypes.STRING, // Password should typically be stored as a STRING (hash)
                allowNull: false,
            },
            remember_token: {
                type: DataTypes.STRING, // Corrected to STRING, typically used for tokens
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // Use current timestamp
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // Use current timestamp
                onUpdate: DataTypes.NOW,     // Ensure updatedAt is updated on changes
            },
        },
        {
            timestamps: true, // Sequelize will handle createdAt and updatedAt automatically
            createdAt: 'created_at',  // Mapping Sequelize `createdAt` to `created_at` in the DB
            updatedAt: 'updated_at',  // Mapping Sequelize `updatedAt` to `updated_at` in the DB
            tableName: "users", // Explicit table name if needed
        }
    );

    module.exports = Users;

