const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FTPClient = require('basic-ftp');

const convertJsonToExcel_old = async (req, res) => {
    try {
        // Fetch data from the external API
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        const jsonData = response.data;

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return res.status(400).json({ error: 'No data found from the API.' });
        }

        // Load the template Excel file
        const templateFilePath = path.join(__dirname, 'list.xlsx');
        const workbook = XLSX.readFile(templateFilePath);

        // Get the 'Suppliers' sheet (sheet index could vary)
        const suppliersSheet = workbook.Sheets['Suppliers'];
        if (!suppliersSheet) {
            return res.status(400).json({ error: "'Suppliers' sheet not found in the template." });
        }

        // Verify if the 'Suppliers' sheet is loaded correctly
        console.log('Suppliers sheet loaded:', suppliersSheet);

        // Prepare data for the first column starting from row 4
        const startingRow = 4; // Start from row 4

        // Ensure we are modifying the correct range and address
        jsonData.forEach((item, index) => {
            const rowIndex = startingRow + index; // Calculate the row index
            const cellAddress = `A${rowIndex}`; // Column 'A' and dynamic row

            // Log the address and the data being written
            console.log(`Writing to cell: ${cellAddress}, Data: ${item.title}`);

            // Write the title from the API data to the cell
			
            suppliersSheet[cellAddress] = { v: item.title }; // 'v' represents the value of the cell
        });

        // After modification, save the updated workbook to a new file
        const updatedFileName = `updated_list_${Date.now()}.xlsx`;
        const updatedFilePath = path.join(__dirname, updatedFileName);

        // Write the changes to the new file
        XLSX.writeFile(workbook, updatedFilePath);
        console.log(`Updated Excel file saved to: ${updatedFilePath}`);

        // FTP upload process
        const client = new FTPClient.Client();
        try {
            await client.access({
                host: '46.202.161.151',
                user: 'u342816200',
                password: 'Vikas@5566',
                secure: true, // Use secure connection
                secureOptions: { rejectUnauthorized: false } // Disable certificate validation
            });

            // Upload the updated file
            await client.uploadFrom(updatedFilePath, updatedFileName);
            await client.close(); // Close FTP connection
        } catch (ftpError) {
            console.error('FTP Error:', ftpError.message); // Log the actual error message
            console.error('Full FTP Error Object:', ftpError); // Optionally log the full error object for debugging
            throw new Error('FTP Upload Failed');
        }

        // Respond with success
        res.json({ message: 'File updated and uploaded successfully!' });

        // Clean up the temporary file after uploading
        fs.unlinkSync(updatedFilePath); // Delete the temporary file

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch data or generate/upload Excel file.' });
    }
};

const sendJson = async (req, res) => {
    try {
        const flattnedBOM = await flatingBOM(req); // Ensure the function completes before proceeding
        res.json({
            status: "success",
            message: "File processed and uploaded successfully",
            data: flattnedBOM
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ status: "error", message: 'Internal Server Error', error: error.message });
    }
};

const flatingBOM = async (req) => {
    const inputData = req.body['CA Details'];
    const ca_name = inputData['CA Name']
    const plm_env = inputData['PLM Environment']
    let output = [];

    function processOuterMEP() {
        if (inputData['Realized Changes']) {
            inputData["Realized Changes"].forEach(change => {
                if (change.MEP && Array.isArray(change.MEP)) {
                    change.MEP.forEach(part => {
                        let transformedItem = {
                            "Item Revision": change["Item Revision"],
                            "Item Reference": change["Item Reference"],
                            "Self FMD Material": change["Self FMD Material"],
                            "Quantity": change["Quantity"],
                            "Level": change["Level"],
                            "Item Type": change["Item Type"],
                            "Item Owner": change["Item Owner"],
                            "Environmental Compliance": change["Environmental Compliance"],
                            "Item Description": change["Item Description"],
                            "Part Description": part["Part Description"],
                            "Item Reference": part["Item Reference"],
                            "Supplier Reference": part["Supplier Reference"],
                            "Part Reference": part["Part Reference"],
                            "Item Type": part["Item Type"]
                        };
                        output.push(transformedItem);
                    });
                }
            });
        }
    }

    function processBOMMEP() {
        if (inputData["Realized Changes"]) {
            inputData["Realized Changes"].forEach(change => {
                if (change.BOM && Array.isArray(change.BOM)) {
                    change.BOM.forEach(change => {
                        if (change["Environmental Compliance"] !== "Not Applicable") {
                            if (change['MEP Details'] && Array.isArray(change['MEP Details']) && change['MEP Details'].length > 0) {
                                change['MEP Details'].forEach(part => {
                                    let transformedItem = {
                                        "Item Revision": change["Item Revision"],
                                        "Item Reference": change["Item Reference"],
                                        "Self FMD Material": change["Self FMD Material"],
                                        "Quantity": change["Quantity"],
                                        "Level": "1",
                                        "Item Type": change["Item Type"],
                                        "Item Owner": change["Item Owner"],
                                        "Environmental Compliance": change["Environmental Compliance"],
                                        "Item Description": change["Item Description"],
                                        "Part Description": part["Part Description"],
                                        "Item Reference": part["Item Reference"],
                                        "Supplier Reference": part["Supplier Reference"],
                                        "Part Reference": part["Part Reference"],
                                        "Item Type": part["Item Type"]
                                    };
                                    output.push(transformedItem);
                                });
                            } else {
                                let transformedItem = {
                                    "Item Revision": change["Item Revision"],
                                    "Item Reference": change["Item Reference"],
                                    "Self FMD Material": change["Self FMD Material"],
                                    "Quantity": change["Quantity"],
                                    "Level": "1",
                                    "Item Type": change["Item Type"],
                                    "Item Owner": change["Item Owner"],
                                    "Environmental Compliance": change["Environmental Compliance"],
                                    "Item Description": change["Item Description"]
                                };
                                output.push(transformedItem);
                            }
                        }
                    });
                }
            });
        }
    }

    processOuterMEP();
    processBOMMEP();

    try {
        const excelResult = await convertJsonToExcel(output,ca_name,plm_env); // Wait for Excel file to be created
        const ftpFilePath = await sendDataToSFTP(excelResult); // Upload the file to SFTP
        return { 
            fileName: excelResult.updatedFileName,
            // filePath: excelResult.updatedFilePath,
            ftpFilePath:ftpFilePath 
        };
    } catch (error) {
        console.error("Error during file processing:", error);
        throw new Error("Failed to process BOM data.");
    }
};

const convertJsonToExcel = async (jsonData,ca_name,plm_env) => {
    const templateFilePath = path.join(__dirname, 'template.xlsx');
    const workbook = XLSX.readFile(templateFilePath);
    const BOMSheet = workbook.Sheets['BOM'];

    if (!BOMSheet) {
        throw new Error("'BOM' sheet not found in the template.");
    }

    const startingRow = 5;
    jsonData.forEach((item, index) => {
        const rowIndex = startingRow + index;
        BOMSheet[`A${rowIndex}`] = { v: item['Level'] };
        BOMSheet[`B${rowIndex}`] = { v: item['Item Reference'] };
        BOMSheet[`C${rowIndex}`] = { v: item['Item Description'] };
        // BOMSheet[`D${rowIndex}`] = { v: item['Item Revision'] };
        BOMSheet[`E${rowIndex}`] = { v: item['Item Owner'] };
        BOMSheet[`F${rowIndex}`] = { v: item['Quantity'] };
        BOMSheet[`G${rowIndex}`] = { v: item['Part Reference'] };
        BOMSheet[`H${rowIndex}`] = { v: item['Supplier Reference'] };
        BOMSheet[`J${rowIndex}`] = { v: 'Active' };
    });

    //filling Parts Sheet
    const PartSheet = workbook.Sheets['Parts'];
    if (!PartSheet) {
        throw new Error("'Parts' sheet not found in the template.");
    }
    const startingRow2 = 5;
    jsonData.forEach((item, index) => {
        const rowIndex = startingRow2 + index;
        PartSheet[`A${rowIndex}`] = { v: item['Part Reference'] };
        PartSheet[`B${rowIndex}`] = { v: item['Part Description'] };
        PartSheet[`C${rowIndex}`] = { v: item['Supplier Reference'] };
    });

    var envName = 'File' //Default name
    if(plm_env == 'https://3dxs12.emerson.com/3dspace'){
        envName = 'Enovia';
    }
    

    const updatedFileName = `${envName}_${ca_name}_${Date.now()}.xlsx`;
    const updatedFilePath = path.join(__dirname, updatedFileName);
    XLSX.writeFile(workbook, updatedFilePath);
    return { updatedFileName, updatedFilePath };
};

const sendDataToSFTP = async (excelResult) => {
    const client = new FTPClient.Client();
    try {
        await client.access({
            host: '46.202.161.151',
            user: 'u342816200',
            password: 'Vikas@5566',
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        const remoteFilePath = excelResult.updatedFileName;
        await client.uploadFrom(excelResult.updatedFilePath, excelResult.updatedFileName);
        await client.close();
        // fs.unlinkSync(excelResult.updatedFilePath);

        return `sftp://46.202.161.151/${remoteFilePath}`;
    } catch (ftpError) {
        console.error('FTP Error:', ftpError.message);
        throw new Error('FTP Upload Failed');
    }
};


module.exports = {convertJsonToExcel_old, sendJson, flatingBOM, convertJsonToExcel, sendDataToSFTP};
